import React from 'react'; 
import { IonPage, IonContent, IonGrid, IonRow, IonCol } from '@ionic/react';
import Layout from '../components/otherlayout';
import { MailOutline, CallOutline } from 'react-ionicons'; // Removed unused PersonCircleOutline
import './about.css';  
import teamImage1 from '../../public/assets/img/arreba.jpg';

const About: React.FC = () => {
  return (
    <IonPage>
      <Layout title="About">
        <IonContent className="about-page-content">
          <div className="p-4">
            <h4>Project Team</h4>
            <hr />
            <IonGrid>
              <IonRow>
                <IonCol size="12" className="text-center team-member">
                  <img src={teamImage1} alt="Team Member" className="img-fluid rounded mb-2" />
                  <div className="member-info">
                    <span className="member-name">Areeba Jamil</span><br />
                    <span className="member-role">(Full Stack Developer)</span>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
            <hr />

            <h4>Description</h4>
            <p>Quiz Folio is a cutting-edge quiz management app designed to enhance educational assessments through interactive features and advanced technologies.</p>
            <hr />

            <h4>Mission Statement</h4>
            <p>To innovate education through technology, providing engaging and personalized learning experiences.</p>
            <hr />

            <h4>Contact Us</h4>
            <p>
              <MailOutline color="#1a73e8" height="30px" width="30px" />{' '}
              <a href="mailto:admin@quizfolio.com" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 'bold' }}>admin@quizfolio.com</a><br />
              <CallOutline color="#1a73e8" height="30px" width="30px" />{' '}
              <a href="tel:+923080000000" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 'bold' }}>+923080000000</a>
            </p>
            <hr />
          </div>
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default About;
