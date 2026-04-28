import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import heroImg from '../../assets/hero.png'
import iconLight from '../../assets/icon-light.png'
import iconDark from '../../assets/icon-dark.png'
import { ChevronLeftIcon, ChevronRightIcon, FileIcon, UserIcon } from '../../assets/icons'
import BLOG_POSTS from '../../data/blogPosts'

const GE_MONTHS = [
  'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
  'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი',
]

const pad = n => String(n).padStart(2, '0')

function formatTestDate(iso) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return `${d.getDate()} ${GE_MONTHS[d.getMonth()]} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const UPCOMING_TESTS = [
  { id: 1, subject: 'მათემატიკა',     etapi: 'I ეტაპი',  date: '2026-05-12T14:00', duration: 90,  questions: 30 },
  { id: 2, subject: 'ფიზიკა',         etapi: 'II ეტაპი', date: '2026-05-15T10:00', duration: 120, questions: 40 },
  { id: 3, subject: 'ქიმია',          etapi: 'I ეტაპი',  date: '2026-05-20T16:00', duration: 90,  questions: 35 },
  { id: 4, subject: 'ბიოლოგია',       etapi: 'III ეტაპი',date: '2026-05-22T12:00', duration: 60,  questions: 25 },
  { id: 5, subject: 'ქართული ენა',    etapi: 'II ეტაპი', date: '2026-05-25T09:00', duration: 100, questions: 50 },
  { id: 6, subject: 'ისტორია',        etapi: 'I ეტაპი',  date: '2026-05-28T11:00', duration: 75,  questions: 30 },
]

function Landing() {
  const navigate = useNavigate()
  const sliderRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [selectedPost, setSelectedPost] = useState(null)

  const updateSliderEdges = () => {
    const el = sliderRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  const scrollSlider = (dir) => {
    const el = sliderRef.current
    if (!el) return
    const card = el.querySelector('.landing-test-card')
    const step = card ? card.offsetWidth + 20 : el.clientWidth
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  useEffect(() => {
    updateSliderEdges()
    const onResize = () => updateSliderEdges()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!selectedPost) return
    const onKey = e => { if (e.key === 'Escape') setSelectedPost(null) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [selectedPost])

  return (
    <div className="landing">

      {/* Navigation */}
      <nav className="landing-nav">
        <Link to="/" className="landing-logo">
          <img src={iconDark} alt="ინოვატორი" />
          <span
            style={{marginTop:"3px"}}
          >ინოვატორი</span>
        </Link>
        <div className="landing-nav-links">
          <a href="#upcoming">ტესტები</a>
          <a href="#blog">ბლოგი</a>
          <a href="#contact">კონტაქტი</a>
        </div>
        <div className="landing-nav-actions">
          <button className="landing-btn-ghost" onClick={() => navigate('/login')}>სისტემაში შესვლა</button>
          {/* <button className="landing-btn-primary" onClick={() => navigate('/register')}>რეგისტრაცია</button> */}
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div
          className="landing-hero-bg"
          style={{ backgroundImage: `url(${'https://images.pexels.com/photos/5428261/pexels-photo-5428261.jpeg'})` }}
          aria-hidden="true"
        />
        <div className="landing-hero-content">
          <img src={iconLight} alt="ინოვატორი" className="landing-hero-logo" />
          <h1>ინოვატორი</h1>
          <p>გამოცდებისთვის მზადება — მარტივად, ერთ ადგილას.</p>
          <button className="landing-btn-cta" onClick={() => navigate('/register')}>
            რეგისტრაცია
          </button>
        </div>
      </section>

      {/* Blog Posts */}
      <section id="blog" className="landing-section">
        <div className="landing-section-head">
          <h2>ბლოგი</h2>
          <a href="#" className="landing-link">ყველა პოსტი →</a>
        </div>

        <div className="landing-blog-grid">
          {BLOG_POSTS.map(p => (
            <div
              key={p.id}
              className="landing-blog-card"
              role="button"
              tabIndex={0}
              onClick={() => setSelectedPost(p)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelectedPost(p)
                }
              }}
            >
              <div
                className="landing-blog-thumb"
                style={{ backgroundImage: `url(${p.image})` }}
              >
                <span className="landing-blog-tag">{p.tag}</span>
              </div>
              <div className="landing-blog-body">
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <div className="landing-blog-meta">
                  <span><UserIcon /> {p.author}</span>
                  <span>{p.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Tests */}
      <section id="upcoming" className="landing-section">
        <div className="landing-section-head">
          <h2>მომავალი ტესტები</h2>
          <div className="landing-slider-controls">
            <button
              className="landing-slide-btn"
              onClick={() => scrollSlider(-1)}
              disabled={!canPrev}
              aria-label="წინა"
            >
              <ChevronLeftIcon />
            </button>
            <button
              className="landing-slide-btn"
              onClick={() => scrollSlider(+1)}
              disabled={!canNext}
              aria-label="შემდეგი"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>

        <div className="landing-slider" ref={sliderRef} onScroll={updateSliderEdges}>
          {UPCOMING_TESTS.map(t => (
            <div key={t.id} className="landing-test-card">
              <div className="landing-test-tag">{t.etapi}</div>
              <h3>{t.subject}</h3>
              <div className="landing-test-meta">
                <span><FileIcon /> {t.questions} კითხვა</span>
                <span>{t.duration} წუთი</span>
              </div>
              <div className="landing-test-date">{formatTestDate(t.date)}</div>
              <button className="landing-btn-secondary" onClick={() => navigate('/register')}>
                რეგისტრაცია
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="landing-footer">
        <div className="landing-footer-grid">
          <div className="landing-footer-brand">
            <div className="landing-logo landing-footer-logo">
              <img src={iconDark} alt="ინოვატორი" />
              <span
                style={{marginLeft:"5px",color:"white"}}
              >ინოვატორი</span>
            </div>
            <p>თანამედროვე გამოცდების პლატფორმა — მოსამზადებელი ტესტებიდან ოფიციალურ ეტაპებამდე.</p>
          </div>

          <div className="landing-footer-col">
            <h4>ბმულები</h4>
            <a href="#upcoming">ტესტები</a>
            <a href="#blog">ბლოგი</a>
            <Link to="/login">შესვლა</Link>
            <Link to="/register">რეგისტრაცია</Link>
          </div>

          <div className="landing-footer-col">
            <h4>რესურსები</h4>
            <a href="#">დახმარება</a>
            <a href="#">წესები</a>
            <a href="#">კონფიდენციალურობა</a>
          </div>

          <div className="landing-footer-col">
            <h4>კონტაქტი</h4>
            <a href="mailto:info@ei.ge">info@ei.ge</a>
            <a href="tel:+995555000000">+995 555 000 000</a>
            <span>თბილისი, საქართველო</span>
          </div>
        </div>

        <div className="landing-footer-bottom">
          © {new Date().getFullYear()} ინოვატორი. ყველა უფლება დაცულია.
        </div>
      </footer>

      {/* Blog post modal */}
      {selectedPost && (
        <div className="blog-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="blog-modal" onClick={e => e.stopPropagation()}>
            <button
              className="blog-modal-close"
              onClick={() => setSelectedPost(null)}
              aria-label="დახურვა"
            >
              ×
            </button>

            <div
              className="blog-modal-cover"
              style={{ backgroundImage: `url(${selectedPost.image})` }}
            >
              <span className="landing-blog-tag">{selectedPost.tag}</span>
            </div>

            <div className="blog-modal-body">
              <h2>{selectedPost.title}</h2>
              <div className="blog-modal-meta">
                <span><UserIcon /> {selectedPost.author}</span>
                <span>·</span>
                <span>{selectedPost.date}</span>
              </div>
              <p className="blog-modal-lead">{selectedPost.excerpt}</p>
              {(selectedPost.content || []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Landing
