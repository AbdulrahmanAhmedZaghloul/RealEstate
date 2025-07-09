import React from 'react';
import classes from '../../styles/Questions.module.css'; // استيراد ملف CSS
import Avatar from '../../assets/Home/Avatar.png'; // استيراد ملف CSS
import Avatar1 from '../../assets/Home/Avatar (1).png'; // استيراد ملف CSS
import Avatar2 from '../../assets/Home/Avatar (2).png'; // استيراد ملف CSS
 
function Questions() {
    return (
        <div className={classes.questionsContainer}>
            {/* الجزء العلوي */}
            <div className={classes.topSection}>
                <div className={classes.avatars}>
                    <div className={classes.Avatar}>
                        <img src={Avatar} alt="Person 1" />
                        <img  className={classes.AvatarPosition} src={Avatar1} alt="Person 2" />
                        <img src={Avatar2} alt="Person 2" />
                    </div>
                </div>
                <h4 className={classes.questionText}>Still have questions?</h4>
                <p>Can’t find the answer you’re looking for ? Please chat to our friendly team.</p>
                <button className={classes.getintouchbtn}>Get in touch</button>
            </div>

            <div className={classes.bottomSection}>
                <h2 className={classes.maintitle}>Grow your real estate <br /> business with confidence.</h2>
                <p className={classes.subtitle}>Take control of listings, contracts, and your team all in one place.</p>
                <button className={classes.getstartedbtn}>Get Started</button>
            </div>
        
        </div>
    );
}

export default Questions;