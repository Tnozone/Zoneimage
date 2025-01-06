
import React, { useState } from 'react';
import './Home.css'
import example from '../assets/example-photo.png'

const Home = () => {
    return (
        <>
            <main>
                <div className="intro">
                    <div className="intro-text">
                        <h2>Modify your photos for your needs</h2>
                        <p>Do you have no photos for your passport and can't find a photographer or booth? Or do you simply wish to change your image's dimensions but don't have access to phtoshop or similar programs? Try our application for a quick and easy solution to your needs.</p>
                        <a href="/Editor">Start now</a>
                    </div>
                    <div className="example-img">
                        <img src={example} alt="result example" />
                    </div>
                </div>
                <div className="howto">
                    <div className="howto-text">
                        <h2>How to use</h2>
                        <ol>
                            <li>Click on "Upload your image" and select the image file you wish to modify.</li>
                            <li>Check the modifications you wish to apply.</li>
                            <li>Click the "Generate" button.</li>
                            <li>Done! Your modified image is there to download.</li>
                        </ol>
                        <p><b>Note:</b> The new background color defaults to white.<br/>
                            The automatic cropping option is for portraits and will center in on the face in the photo.<br/>
                            When using the manual cropping option, you can change the height-to-width ratio with the number inputs and zoom in with your scroll wheel.<br/>
                            The image scaling uses the inputs to either height or width.</p>
                    </div>
                    <div className="howto-example">
                        <img src="placeholder.jpg" alt="editor interface" />
                    </div>
                    <a to="/Editor">Start now</a>
                </div>
            </main>
      </>
    );
};

export default Home;