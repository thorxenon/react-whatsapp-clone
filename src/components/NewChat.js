import React, {useState, useEffect} from 'react';
import './NewChat.css';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Api from '../Api';

export default ({user, chatList, show, setShow}) =>{

    const [list,setList] = useState([]);

    const handleClose = () =>{
        setShow(false);
    }

    useEffect(()=>{
        const getList  = async() =>{
            if(user !== null){
                let results = await Api.getContactList(user.id);
                setList(results);
            }
        }
        getList();
    },[user])

    const addNewChat = async(user2) =>{
        await Api.addNewChat(user,user2);

        handleClose();
    }


    return(
        <div className="new-chat" style={{left:show ? 0 : -415}}>
            <div className="new-chat-head">
                <div onClick={handleClose} className="new-chat-back-button">
                    <ArrowBackIcon style={{color:'#ffffff'}}/>
                </div>
                <div className="new-chat-head-title">Nova Conversa</div>
            </div>
            <div className="new-chat-list">
                {list.map((item, key)=>(
                    <div onClick={()=>addNewChat(item)} className="new-chat-item">
                        <img src={item.avatar} alt="" className="new-chat-item-avatar"/>
                        <div className="new-chat-item-name">{item.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};