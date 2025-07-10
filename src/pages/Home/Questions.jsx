import React from 'react';
import classes from '../../styles/Questions.module.css'; // استيراد ملف CSS
import Avatar from '../../assets/Home/Avatar.png'; // استيراد ملف CSS
import Avatar1 from '../../assets/Home/Avatar (1).png'; // استيراد ملف CSS
import Avatar2 from '../../assets/Home/Avatar (2).png'; // استيراد ملف CSS
import { useTranslation } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

function Questions() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  return (
    <div className={classes.questionsContainer}>
      {/* الجزء العلوي */}
      <div className={classes.topSection}>
        <div className={classes.avatars}>
          <div className={classes.Avatar}>
            <img src={Avatar} alt="Person 1" />
            <img className={classes.AvatarPosition} src={Avatar1} alt="Person 2" />
            <img src={Avatar2} alt="Person 2" />
          </div>
        </div>
        <h4 className={classes.questionText}>{t.StillHaveQuestions}</h4>
        <p>{t.CantFindTheAnswerYoureLookingForPleaseChatToOurFriendlyTeam}</p>
        <button
          onClick={() => navigate("/ContactUs")}
          className={classes.getintouchbtn} o>{t.GetInTouch}</button>
      </div>

      <div className={classes.bottomSection}>
        <h2 className={classes.maintitle}>{t.GrowYourRealEstateBusinessWithConfidence}</h2>
        <p className={classes.subtitle}>{t.TakeControlOfListingsContractsAndYourTeamAllInOnePlace}</p>
        <button onClick={() => navigate("/register")} className={classes.getstartedbtn}>{t.GetStarted}</button>
      </div>
    </div>
  );
}

export default Questions;