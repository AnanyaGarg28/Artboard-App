import { AiFillHome } from 'react-icons/ai'
import { BiUser } from 'react-icons/bi'


function Header({setVisible}) {
    return (
        <div className='flex pb-5 text-slate-700'>
            <div className='grow'>
                <button type="button" > <AiFillHome/></button> 
            </div>
            <div className='grow text-pink-400 text-center'>
                Artboard
            </div>
            <div className='grow text-right'>
                <button onClick={()=>setVisible(true)} type="button" className="hover:opacity-70" > <BiUser /></button>
            </div>
        </div>
    );
}

export default Header;