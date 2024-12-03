import React from 'react'

const GlyphEffect = ({text, isNav=true}) => {
    const GLYPHS =
    'ラドクリフマラソンわたしワタシんょンョたばこタバコとうきょうトウキョウ0123456789±!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
    return (
      <>
        <button className='nav_btn' style={{ '--speed': 0.5}}>
          {text?.split('').map((char, index) => {
            return (
              <span
                className={`${isNav ? "nav_btn__span" : "nav_btn__span2"}`}
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