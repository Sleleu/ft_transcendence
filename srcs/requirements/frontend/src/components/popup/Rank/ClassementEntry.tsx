import { relative } from 'path'
import React from 'react'
import { CSSProperties, useState } from 'react'

const ClassementEntry = () => {

const Entry: CSSProperties = {
    flexBasis: '50px',
    margin: '5px',
    marginLeft: '5px',
    
    background: 'rgba(0, 0, 0, 0.9)',
    borderRadius: '15px',
    
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
}

const entryText: CSSProperties = {
    flexBasis: '250px',
    marginTop: '10px',
    marginLeft: '30px',
    fontWeight : '600',
    fontSize : '24px',
    fontFamily: 'montserrat',
    color: '#fff',

    // border: '2px solid red',
  }

  return (
    <div style={Entry}>
      <span style={entryText}>1</span>
      <span style={entryText}>SleleDu93</span>
      <span style={entryText}>2561</span>
      <span style={entryText}>143</span>
      <span style={entryText}>54%</span>
    </div>
  )
}

export default ClassementEntry
