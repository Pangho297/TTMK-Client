import React from 'react';
import { useMediaQuery } from 'react-responsive';
import Logout from './Logout';
import UserName from './UserName';
import SearchContainer from './SearchContainer';
import GoSearch from './GoSearch';
import FilterBtn from './FilterBtn';
import GoMypage from './GoMypage';
import {device} from '../../style/variable';
import './style/MyoptionGroup.scss';

const MyoptionGroup:React.FC = () => {
  const isMobile = useMediaQuery({
    query: `${device.mobile}`
  });
  return (
    <div className='myoptionGroup-container'>
      {isMobile ? 
        <>
          {/* <GoSearch/> */}
          <SearchContainer/>
          <GoMypage/>
        </> : 
        <>
          <div className='GoSearch-container'>
            <GoSearch />
          </div>
          <div className='FilterBtn-container'>
            <FilterBtn/>
          </div>
          <div className='username-container'>
            <UserName />
          </div>
          <div className='Logout-container'>
            <Logout/>
          </div>
        </>
      } 
    </div>
  );
};

export default MyoptionGroup;
