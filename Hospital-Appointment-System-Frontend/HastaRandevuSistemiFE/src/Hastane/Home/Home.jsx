import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Home.css';
import { getAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId } from '../../api/api-hasta';
import defaultHaberImage from '../../assets/default-haber.jpeg';
import defaultEtkinlikImage from '../../assets/default-etkinlik.png';
import LoadingAnimation from '../../components/LoadingAnimation/LoadingAnimation';

const Home = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [eventPage, setEventPage] = useState(0);
  const [newsPage, setNewsPage] = useState(0);
  const [slides, setSlides] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const { hastaneId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllSlidersAndEtkinlikAndDuyuruAndHaberByHastaneId(hastaneId);
        setSlides(response.sliders);
        setAnnouncements(response.duyurular);
        setEvents(response.etkinlikler);
        setNews(response.haberler);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [hastaneId]);

  if (!slides && !announcements && !events && !news) {
    return (
      <div className="checking">
        <div className="loading-alert-wrapper">
          <LoadingAnimation />
        </div>
        <p className="loading-message">Bilgiler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Slider Bölümü */}
      <div className="slider-container">
        {slides.length > 0 ? (
          <>
            <div className="slider" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
              {slides.map((slide, i) => (
                <div key={i} className="slide">
                  <img src={slide.resim} alt={`Slide ${i + 1}`} />
                  <div className="slide-text">{slide.slideBaslik}</div>
                </div>
              ))}
            </div>
            <div className="slider-controls">
              <button onClick={() => setSlideIndex(prev => Math.max(0, prev - 1))}>
                <FaChevronLeft />
              </button>
              <button onClick={() => setSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}>
                <FaChevronRight />
              </button>
            </div>
          </>
        ) : (
          <p>Henüz slider eklenmedi.</p>
        )}
      </div>

      {/* Duyuru ve Etkinlikler Bölümü */}
      <div className="announcements-events">
        <div className="announcements">
          {announcements.length > 0 ? (
            <>
              {announcements.slice(0, 3).map((ann, i) => (
                <div key={i} className="announcement-card">
                  <h3>{ann.baslik}</h3>
                  <p>{ann.icerik.length > 46 ? ann.icerik.substring(0, 46) + "..." : ann.icerik}</p>
                </div>
              ))}
              {announcements.length > 0 && (
                <button className="duyurular-btn" onClick={() => navigate(`/${hastaneId}/duyurular`)}>Tüm Duyurular</button>
              )}
            </>
          ) : (
            <p>Henüz duyuru eklenmedi.</p>
          )}
        </div>

        <div className="events">
          {events.length > 0 ? (
            <>
              <div className="event-grid">
                {events.slice(eventPage * 6, (eventPage + 1) * 6).map((event, i) => (
                  <div key={i} className="event-card">
                    <div className="event-date">
                      {new Date(event.tarih).toLocaleDateString()}
                      <img
                        src={event.resim}
                        alt="Etkinlik Resmi"
                        onError={(e) => {
                          e.target.src = defaultEtkinlikImage;
                        }}
                      />
                    </div>
                    <div className="event-info">
                      <h4>{event.baslik}</h4>
                      <p>{event.icerik.length > 60 ? event.icerik.substring(0, 60) + "..." : event.icerik}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="events-controls">
                <div>
                  <button
                    onClick={() => setEventPage(prev => Math.max(0, prev - 1))}
                    disabled={eventPage === 0}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={() => setEventPage(prev => prev + 1)}
                    disabled={(eventPage + 1) * 6 >= events.length}
                  >
                    <FaChevronRight />
                  </button>
                </div>
                <button className="all-button" onClick={() => navigate(`/${hastaneId}/etkinlikler`)}>Tüm Etkinlikler</button>
              </div>
            </>
          ) : (
            <p>Henüz etkinlik eklenmedi.</p>
          )}
        </div>
      </div>

      {/* Haberler Bölümü */}
      <div className="news-section">
        {news.length > 0 ? (
          <>
            <div className="news-grid">
              {news.slice(newsPage * 3, (newsPage + 1) * 3).map((item, i) => (
                <div key={i} className="news-card">
                  <img
                    src={item.resim}
                    alt={`Haber ${i + 1}`}
                    onError={(e) => {
                      e.target.src = defaultHaberImage;
                    }}
                  />
                  <div className="news-date">{new Date(item.tarih).toLocaleDateString()}</div>
                  <h3>{item.baslik}</h3>
                  <p>{item.icerik.length > 80 ? item.icerik.substring(0, 80) + "..." : item.icerik}</p>
                </div>
              ))}
            </div>
            <div className="news-controls">
              <div>
                <button
                  onClick={() => setNewsPage(prev => Math.max(0, prev - 1))}
                  disabled={newsPage === 0}
                >
                  <FaChevronLeft />
                </button>
                <button
                  onClick={() => setNewsPage(prev => prev + 1)}
                  disabled={(newsPage + 1) * 3 >= news.length}
                >
                  <FaChevronRight />
                </button>
              </div>
              <button className="all-button" onClick={() => navigate(`/${hastaneId}/haberler`)}>Tüm Haberler</button>
            </div>
          </>
        ) : (
          <p>Henüz haber eklenmedi.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
