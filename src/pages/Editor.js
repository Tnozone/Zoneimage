import './Editor.css';
import Header from './components/Header';
import React, { useState } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { fillTransparency } from './fillTransparency';
import { invertColors } from './utils/InvertColors';
import { convertToBlackAndWhite } from './utils/BlackAndWhite';
import { adjustSaturation } from './utils/AdjustSaturation';
import { autoCrop as performAutoCrop } from './utils/AutoCrop';
import { ManualCrop } from './ManualCrop';
import { setCropping } from './utils/setCropping';
import { scaleImage } from './utils/scaleImage';

const Editor = () => {
    return (
        <Header />
    );
};

export default Editor;