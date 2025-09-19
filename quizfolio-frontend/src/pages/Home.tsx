import React from 'react';
import { IonPage, IonContent, IonCard, IonCardContent, IonImg } from '@ionic/react';
import { FaPencilAlt, FaRobot, FaTrophy, FaDownload, FaBrain, FaFacebook, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import './home.css';  
import Layout from '../components/otherlayout';

const Home: React.FC = () => {
  return (
    <IonPage>
      <Layout title="Quiz Folio" showBackButton={false}>
        <IonContent className="ion-padding">
          <div className="welcome-section">
            {/* Main Logo */}
            <div className="main-logo-container">
              <img 
                src="/assets/img/quizfolio.png" 
                alt="Quizfolio Logo" 
                className="main-logo"
              />
            </div>
            
            <h1 className="welcome">Welcome to Quiz Folio</h1>
            
            {/* Feature Icons with Captions */}
            <div className="feature-icons">
              <div className="feature-item">
                <FaPencilAlt size={32} className="feature-icon" />
                <span className="feature-caption">Create Quizzes</span>
              </div>
              <div className="feature-item">
                <FaRobot size={32} className="feature-icon" />
                <span className="feature-caption">Smart AI</span>
              </div>
              <div className="feature-item">
                <FaTrophy size={32} className="feature-icon" />
                <span className="feature-caption">Win Rewards</span>
              </div>
              <div className="feature-item">
                <FaDownload size={32} className="feature-icon" />
                <span className="feature-caption">Save Results</span>
              </div>
              <div className="feature-item">
                <FaBrain size={32} className="feature-icon" />
                <span className="feature-caption">Learn Better</span>
              </div>
            </div>
            
            {/* Welcome Banner using online image */}
            <IonCard className="welcome-banner">
              <IonImg 
                src="https://img.freepik.com/free-vector/quiz-word-concept_23-2147844150.jpg" 
                alt="Quiz Banner" 
                className="banner-image"
              />
              <div className="banner-overlay">
                <h2>Quiz Portfolio</h2>
                <p>Your knowledge, your way</p>
              </div>
            </IonCard>
            
            {/* Image Gallery */}
            <div className="image-gallery">
              <h2 className="gallery-title">Explore Quiz Possibilities</h2>
              <div className="gallery-grid">
                <IonCard className="gallery-card">
                  <IonImg 
                    src="https://img.freepik.com/free-vector/online-certification-illustration_23-2148575636.jpg" 
                    alt="Quiz Certification" 
                  />
                </IonCard>
                <IonCard className="gallery-card">
                  <IonImg 
                    src="https://img.freepik.com/free-vector/students-watching-webinar-computer-studying-online_74855-15522.jpg" 
                    alt="Online Learning" 
                  />
                </IonCard>
                <IonCard className="gallery-card">
                  <IonImg 
                    src="https://img.freepik.com/free-vector/college-university-students-group-young-happy-people-standing-isolated-white-background_575670-66.jpg" 
                    alt="Students Group" 
                  />
                </IonCard>
              </div>
            </div>
            
            {/* Description */}
            <IonCard className="description-card">
              <IonCardContent>
                <h2 className="subtitle">Revolutionizing Quiz Management</h2>
                <p className="description">
                  🌟 Traditional quizzes? Not here! We're all about dynamic learning experiences. 
                  Quizfolio empowers educators to manage quizzes seamlessly, while students
                  receive immediate feedback and track their progress.
                  Ready to embark on this educational journey? 🚀
                </p>
              </IonCardContent>
            </IonCard>
            
            {/* Social Icons */}
            <div className="social-icons">
              <FaFacebook size={28} className="social-icon" />
              <FaWhatsapp size={28} className="social-icon" />
              <FaTwitter size={28} className="social-icon" />
            </div>
          </div>
        </IonContent>
      </Layout>
    </IonPage>
  );
};

export default Home;
