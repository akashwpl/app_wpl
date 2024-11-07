import React from 'react'

const GlyphEffect = ({text, nav}) => {
    const GLYPHS =
    'ラドクリフマラソンわたしワタシんょンョたばこタバコとうきょうトウキョウ0123456789±!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
    return (
      <>
        <button className='nav_btn' style={{ '--speed': 0.5}}>
          {text?.split('').map((char, index) => {
            return (
              <span
                className='nav_btn__span'
                data-char={char}
                style={{
                  '--index': index,
                  '--char-1': `"${
                    GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                  }"`,
                  '--char-2': `"${
                    GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                  }"`,
                  '--char-3': `"${
                    GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                  }"`,
                }}
              >
                {char}
              </span>
            )
          })}
        </button>
        
      </>
    )
    

}

export default GlyphEffect