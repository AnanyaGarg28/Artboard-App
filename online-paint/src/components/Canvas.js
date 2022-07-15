import { useState, useRef, useEffect, useCallback } from 'react';
import { FiDownload } from 'react-icons/fi';
import { BsFillPenFill } from 'react-icons/bs';
import { FaPencilAlt } from 'react-icons/fa';
import { IoMdBrush } from 'react-icons/io';
import { BsEraser } from 'react-icons/bs';
import { VscSymbolColor } from 'react-icons/vsc';
import  Header  from './Header';
import { AccountInfo } from './AccountInfo';

function Canvas() {
  const canvasRef = useRef(null);
  const context = useRef(null);
  const colorPickerRef = useRef(null);

  const [color, setColor] = useState("");
  const [visible,setVisible] = useState(false);  

  const [mouseDown, setMouseDown] = useState(false);
  const [firstPosition, setFirstPosition] = useState({
    x: 0,
    y: 0
  });

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }
  }, []);

  const ColorPicker = () => {
    return (
      <input className='absolute invisible' ref={colorPickerRef} type="color" value={color} onChange={e => setColor(e.target.value)}/>
    );
  }

  const computeCoordinatesInCanvas = (oldX,oldY) => {
    const boundingRectangle = canvasRef.current.getBoundingClientRect()
    return {
      x: oldX-boundingRectangle.left,
      y: oldY-boundingRectangle.top
    }
  }

  const onMouseDown = (e) => {
    setFirstPosition(computeCoordinatesInCanvas(
      e.pageX, e.pageY
    ))
    setMouseDown(true)
  }
  //by default - pen type is simple pencil
  const draw = useCallback((x,y) => { 
    if (mouseDown) {
      context.current.beginPath();
      context.current.strokeStyle = color;
      context.current.moveTo(firstPosition.x, firstPosition.y);
      context.current.lineTo(x, y);
      context.current.closePath();
      context.current.stroke();
      setFirstPosition({
        x,
        y
      })
    }
  }, [firstPosition, mouseDown, color, setFirstPosition])
  
  
  const usePen = (initialPenType) => {
    const [penType, setPenType] = useState(initialPenType);
    const changePenType = (pen) => {
      setPenType(pen);
      switch(pen){
        case 'pencil': 
          context.current.lineWidth=1;
          context.current.lineJoin = context.current.lineCap = 'square';
          context.current.shadowBlur = 0;
          context.current.shadowColor = 'rgb(0,0,0)'; 
          break;
        case 'pen':
          context.current.lineWidth=10;
          context.current.lineJoin = context.current.lineCap = 'round';
          context.current.shadowBlur = 0;
          context.current.shadowColor = 'rgb(0, 0, 0)'; 
          break;
        case 'shadow':
          context.current.lineWidth = 10;
          context.current.lineJoin = context.current.lineCap = 'round';
          context.current.shadowBlur = 10;
          context.current.shadowColor = 'rgb(0, 0, 0)'; 
        default : 
      }
    }
    return changePenType;
  }

  const setPen = usePen('pencil');
  const onMouseMove = (e) => {
    const {x, y} = computeCoordinatesInCanvas(e.pageX, e.pageY)
    draw(x,y);
  }
  const onMouseUp = () => {
    setMouseDown(false);
  }
  const onMouseLeave = () => {
    setMouseDown(false);
  }
  const clearCanvas = () => {
    context.current.clearRect(0, 0, context.current.canvas.width, context.current.canvas.height)
  }
  const download = async () => {
    const image = canvasRef.current.toDataURL('image/png');
    const blob = await (await fetch(image)).blob();
    const blobURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobURL;
    link.download = "image.png";
    link.click();
  }
  return (
    <>
    {visible && <AccountInfo setVisible={setVisible} />}
    <div className="text-5xl p-10">
      <Header setVisible={setVisible} />
      <div className='flex flex-rows pb-4 pt-2 w-[80%] mx-auto'>
        <div className='grow text-left'> 
          <button type="button" className='text-slate-600 mx-2 hover:text-pink-400' onClick={() => {setPen('pencil')}}> <FaPencilAlt /></button>
          <button type="button" className='text-slate-600 mx-2 hover:text-pink-400' onClick={() => {setPen('pen')}}> <BsFillPenFill /></button>
          <button type="button" className='text-slate-600 mx-2 hover:text-pink-400' onClick={() => {setPen('shadow')}}> <IoMdBrush /></button>
          <button type="button" className='text-slate-600 mx-2 hover:text-pink-400' onClick={() => {clearCanvas()}}> <BsEraser /></button>
          <div className='relative inline-block align-top'>
            <button type="button" className='text-slate-600 mx-2 block hover:text-pink-400' onClick={()=>{
              colorPickerRef.current.click()}}> <VscSymbolColor /></button>
            <ColorPicker />
          </div>
        </div>
        <div className='grow text-right'>
          <button type="button" className='text-slate-600 hover:text-pink-400' onClick={download}> <FiDownload/></button>
        </div>
      </div>
      <div className='flex justify-center'>
        <canvas 
          ref={canvasRef}
          width={window.innerWidth*0.8}
          height={window.innerHeight*0.8}
          className='px-50'
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          style={{
            border: "1px dashed #000"
          }}
        /> 
      </div>      
    </div>
    </>
  );
}

export default Canvas;
