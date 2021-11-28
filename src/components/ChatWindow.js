import React, {useState, useEffect, useRef} from 'react';
import EmojiPicker from 'emoji-picker-react';
import './ChatWindow.css';

import Api from './../Api';

import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import MicIcon from '@material-ui/icons/Mic';

import MessageItem from './MessageItem';



export default ({user, data}) =>{

    const body = useRef();

    let recognition = null;
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(SpeechRecognition !== undefined){
        recognition = new SpeechRecognition();
    }

    const [emojiOpen, setEmojiOpen] = useState(false);
    const [text,setText] = useState('');
    const [listening, setListening] = useState(false);
    const [list, setList] = useState([]);
    const [users, setUsers] = useState([])

    useEffect(()=>{
        setList([]);
        let unsub = Api.onChatContent(data.chatId, setList, setUsers);
        return unsub;
    },[data.chatId])

    useEffect(()=>{
        if(body.current.scrollHeight > body.current.offsetHeight){
            body.current.scrollTop = body.current.scrollHeight - body.current.offsetHeight
        };
    },[list])

    const handleEmojiClick = (e, emojiObjet) =>{
        setText(text + emojiObjet.emoji);
    };

    const handleOpenEmoji = () =>{
        setEmojiOpen(true);
    };

    const handleCloseEmoji = () =>{
        setEmojiOpen(false);
    };

    const handleMicClick = () =>{
        if(recognition !== null){
            recognition.onstart = () =>{
                setListening(true);
            };
            recognition.onend = () =>{
                setListening(false);
            }
            recognition.onresult = (e) =>{
                setText(e.results[0][0].transcript);
            }

            recognition.start();
        };
    };

    const handleInputKeyUp = (e) =>{
        if(e.keyCode == 13){
            handleSendCLick();
        }
    }

    const handleSendCLick = () =>{
        if(text !== ''){
            Api.sendMessage(data, user.id, 'text', text,users);
            setText('');
            setEmojiOpen(false);
        }
    };

    


    return(
        <div className="chat-window">
            <div className="chat-window-header">
                <div className="chat-window-header-info">
                    <img className="chat-window-avatar" src={data.image} alt=""/>
                    <div className="chat-window-name">{data.title}</div>
                </div>
                <div className="chat-window-header-buttons">
                    <div className="chat-window-btn">
                        <SearchIcon style={{color:'#919191'}}/>
                    </div>

                    <div className="chat-window-btn">
                        <AttachFileIcon style={{color:'#919191'}}/>
                    </div>

                    <div className="chat-window-btn">
                        <MoreVertIcon style={{color:'#919191'}}/>
                    </div>
                </div>
            </div>
            <div ref={body} className="chat-window-body">
                {list.map((item, key)=>(
                    <MessageItem
                        key={key}
                        data={item}
                        user={user}
                    />
                ))}
            </div>

            <div
                className="chat-window-emojiarea"
                style={{height: emojiOpen ? '200px' : '0px'}}
                >
                <EmojiPicker
                onEmojiClick={handleEmojiClick}
                    disableSearchBar
                    disableSkinTonePicker

                />
            </div>

            <div className="chat-window-footer">
                <div className="chat-window-pre">
                    
                    <div
                        className="chat-window-btn"
                        onClick={handleCloseEmoji}
                        style={{width: emojiOpen ? 40 : 0}}
                    >
                        <CloseIcon style={{color:'#919191'}}/>
                    </div>

                    <div
                        className="chat-window-btn"
                        onClick={handleOpenEmoji}
                    >
                        <InsertEmoticonIcon style={{color: emojiOpen ?'#009688' : '#919191'}}/>
                    </div>
                </div>
                <div className="chat-window-inputarea">
                    <input
                        className="chat-window-input"
                        type="text"
                        placeholder="Digite uma mensagem"
                        value={text}
                        onChange={e=>setText(e.target.value)}
                        onKeyUp={handleInputKeyUp}
                    />
                </div>
                <div className="chat-window-pos">
                    {text === '' &&

                        <div onClick={handleMicClick} className="chat-window-btn">
                            <MicIcon style={{color: listening ? '#126ECE' : '#919191'}}/>
                        </div>
                    }

                    {text !== '' &&

                        <div onClick={handleSendCLick} className="chat-window-btn">
                            <SendIcon style={{color:'#919191'}}/>
                        </div>
                    }
                </div>

                
            </div>
        </div>
    );
};