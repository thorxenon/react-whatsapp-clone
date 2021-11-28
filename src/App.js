import React, { useState, useEffect} from 'react';
import './App.css';

import Api from './Api';

import ChatListItem from './components/ChatListItem';
import ChatIntro from './components/ChatIntro';
import ChatWindow from './components/ChatWindow';
import NewChat from './components/NewChat';

import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import Login from './components/Login';



export default ()=>{

	const [chatList, setChatList] = useState([]);
	const [activeChat, setActiveChat] = useState({});
	const [user, setUser] = useState(null);

	useEffect(()=>{
		if(user !== null){
			let unsub = Api.onChatList(user.id, setChatList);
			return unsub;
		}
	},[user]);

	const [showNewChat, setShowNewChat] = useState(false);

	const handleNewChat = () =>{
		setShowNewChat(true);
	}

	const handleLoginData = async(u) =>{
		let newUser = {
			id: u.uid,
			name: u.displayName,
			avatar: u.photoURL
		};
		await Api.addUser(newUser);
		setUser(newUser);
	}

	if(user === null){
		return (<Login onReceive={handleLoginData}/>)
	}

  	return(
		<div className="app-window">
			<div className="side-bar">
				<NewChat
					chatList={chatList}
					user={user}
					show={showNewChat}
					setShow={setShowNewChat}
				/>
				<header>
					<img className="header-avatar" src={user.avatar} alt=""/>
					<div className="header-buttons">
						<div className="header-btn">
							<DonutLargeIcon style={{color:'#919191'}}/>
						</div>

						<div onClick={handleNewChat} className="header-btn">
							<ChatIcon style={{color:'#919191'}}/>
						</div>

						<div className="header-btn">
							<MoreVertIcon style={{color:'#919191'}}/>
						</div>
					</div>
				</header>
				<div className="search">
					<div className="search-input">
						<SearchIcon fontSize="small" style={{color:'#919191'}} />
						<input type="search" placeholder="Procurar ou começar uma nova conversa"/>
					</div>
				</div>
				<div className="chat-list">
					{chatList.map((item,key)=>(
						<ChatListItem
							active={activeChat.chatId === chatList[key].chatId}
							data={item}
							key={key}
							onClick={()=>setActiveChat(chatList[key])}
						/>
					))}
				</div>
			</div>
			<div className="content-area">
				{activeChat.chatId !== undefined &&
					<ChatWindow
						user={user}
						data={activeChat}
					/>
				}
				{activeChat.chatId === undefined &&
					<ChatIntro/>
				}
			</div>
		</div>
  	);
};