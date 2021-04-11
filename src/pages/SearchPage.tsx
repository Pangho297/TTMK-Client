import React, {useEffect} from 'react';
import { useDispatch, useSelector, RootStateOrAny  } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { UserInfoHandler, LocationInfoHandler } from '../redux/modules/UserInfo';
import { LoginHandler} from '../redux/modules/account';
import { RootState } from '../redux/modules/reducer';
// import {initialState} from '../';
import ItemCard from '../components/ItemCard/index';
import {Container} from './style/SearchPageStyle';
import { Item, ItemHandler } from '../redux/modules/Items';
import {kakaoKey} from '../modules/constants';
import {auctionSocket, bidData} from '../modules/socket';
import { getFormatedItems } from '../modules/converters';

import axios from 'axios';

interface MatchParams {
  keyword: string;
}

const SearchPage:React.FC<RouteComponentProps<MatchParams>> = ({match}) => {


  const userInfoState = useSelector((state: RootState) => state.UserInfoReducer);
  const { id, city } = userInfoState;
  const itemState = useSelector((state:RootStateOrAny) => state.ItemReducer);
  const {items} = itemState;
  const dispatch = useDispatch();

  //ouath관련 함수
  const oauthLoginHandler = async (authorizationCode: string) => {
    await axios.post('https://localhost:4000/user/oauth',
      { authorizationCode },
      {withCredentials: true})
      .then(res => {
        console.log('res.data = ', res.data);
        dispatch(UserInfoHandler({id: res.data.id, kakaoId: res.data.kakaoId, name: res.data.name}));
        dispatch(LoginHandler(true));
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('id', res.data.id);
        window.location.href = '/ko/search';
      });
  };
  
  
  useEffect(() => {

    //search 페이지 들어오면 할일

    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get('code');
    const login = localStorage.getItem('isLogin');
    

    if(login === 'true') {
      dispatch(LoginHandler(true));
    }

    if (authorizationCode && id === 0) {
      console.log(authorizationCode);
      oauthLoginHandler(authorizationCode);
      dispatch(LoginHandler(true));
    }

    //1. 사용자에게 위치 정보 이용 동의 요청을 보낸다

    if(city === '') {
      if(window.navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async ({coords}) => {
          const address = await axios.get(
            `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${coords.longitude}&y=${coords.latitude}`,
            {
              headers: {
                Authorization: `KakaoAK ${kakaoKey.REST_API}`,
              },
            }
          );
          const {region_1depth_name, region_2depth_name} = address.data.documents[0].address;
          dispatch(LocationInfoHandler(`${region_1depth_name} ${region_2depth_name}`));
          localStorage.setItem('city', `${region_1depth_name} ${region_2depth_name}`);
          
        });
      } else {
        alert('GPS를 지원하지 않습니다');
      }
    }
    
    // 2-(1) 검색키워드가 있을 때 서버에 요청

    const SearchValue = (document.getElementById('searchbar') as HTMLInputElement);

    if(SearchValue.value === null) {
      SearchValue.value = '';
    }
    SearchValue.value = '';

    console.log('match.params.keyword=', match.params.keyword);
          
    if(match.params.keyword) {
      axios.get('https://localhost:4000/search',
        { params: { city: city, keyword: match.params.keyword }})
        .then(res => {
          console.log('SearchPage에서 city', res.data.items.city);
          // 리덕스 상태 만들어서 응답으로 온 검색결과 저장하기
          dispatch(ItemHandler(getFormatedItems(res.data.items))); 
        });
    }
    //2-(2) 검색 키워드가 없을때(처음 입장) 모든 자료 요청
    if(!match.params.keyword) {
      axios.get('https://localhost:4000/search',
        { params: { city: city}})
        .then(res => {
          console.log(getFormatedItems(res.data.items));
          // 리덕스 상태 만들어서 응답으로 온 검색결과 저장하기
          dispatch(ItemHandler(getFormatedItems(res.data.items))); //검색결과 받아서 리덕스에 저장
        });
    }

    //3. socketio에 연결: 가격정보 수신 시 querySelector로 해당 부분의 가격을 변경한다.
    auctionSocket.on('bid', ({itemId, price}: bidData) => {
      console.log('receive bid', price);
      const priceDiv = document.querySelector(`#itemcard-${itemId}`) as Node;
      priceDiv.textContent = price.toString();
    });
  }, [],);
  console.log('SearchPage에서 city', items);
  


  return (
    <Container>
      {
        items ? (items.map((item: Item) => 
          <ItemCard item={item} key={item.id}></ItemCard>
        )) : <></>
      }
    </Container>
  );
};


export default withRouter(SearchPage);
