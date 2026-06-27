import FsLightbox from 'fslightbox-react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import './CSS/About.css';
import certificateImages from '../assets/Routes/AllCertificate';
import achievementImages from '../assets/Routes/AllAchievement';

function About() {
  const [activeTab, setActiveTab] = useState('certificates');
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1,
  });

  const activeImages =
    activeTab === 'certificates' ? certificateImages : achievementImages;

  function openLightboxOnSlide(number) {
    setLightboxController({
      toggler: !lightboxController.toggler,
      slide: number,
    });
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Imad Ez - About</title>
        </Helmet>
      </HelmetProvider>
      <FsLightbox
        toggler={lightboxController.toggler}
        sources={activeImages}
        slide={lightboxController.slide}
      />
      <Container fluid className="about-wrapper">
        <div className="about-left animate__animated animate__zoomIn">
          <h3>About</h3>
          <h4>
            ───&nbsp;&nbsp;Page <strong>02</strong>
          </h4>
        </div>
        <div className="about-right animate__animated animate__fadeIn animate__slower py-3">
          <p>
            Hi, I'm Imad Ezzat Fanany, an Informatics Engineering student at STT Terpadu Nurul Fikri.
             I have a strong interest in web development and cyber security. Currently, 
             I am actively expanding my skills in PHP and the Laravel framework to build web applications, 
             while also exploring network administration and security concepts to create safer digital solutions.
          </p>

          <div className="certificates-tab-header">
            <h4
              className={activeTab === 'certificates' ? 'tab-active' : 'tab-inactive'}
              onClick={() => setActiveTab('certificates')}
            >
              Certificates
            </h4>
            <h4
              className={activeTab === 'achievement' ? 'tab-active' : 'tab-inactive'}
              onClick={() => setActiveTab('achievement')}
            >
              Achievement
            </h4>
          </div>

          <div className="certificates-wrapper">
            {activeImages
              .reduce((rows, src, index) => {
                if (index % 3 === 0) rows.push([]);
                rows[rows.length - 1].push(
                  <div className="col certificates-ratio gap-image" key={src}>
                    <img
                      className="shadow"
                      loading="lazy"
                      src={src}
                      alt={`${activeTab === 'certificates' ? 'Certificate' : 'Achievement'} ${index + 1}`}
                      onClick={() => openLightboxOnSlide(index + 1)}
                    />
                  </div>
                );
                return rows;
              }, [])
              .map((row, index) => (
                <div className="row my-4" key={index}>
                  {row}
                </div>
              ))}
          </div>
        </div>
      </Container>
    </>
  );
}

export default About;