import Link from 'next/link';

const CallToAction = () => {
  return (
    <section id="call-to-action" className="call-to-action section dark-background">
      <img src="/assets/img/portfolio/IMG_3499.JPG" alt="Call to Action" />
      <div className="container">
        <div className="row justify-content-center" data-aos="zoom-in" data-aos-delay="100">
          <div className="col-xl-10">
            <div className="text-center">
              <h3>Join the Grassroots Mobilization</h3>
              <p>Be part of 1 million youth demanding accountability, unity, and integrity from our leaders. Join the movement mobilizing Arewa for political, economic, and industrial progress.</p>
              <Link href="/get-involved" className="cta-btn">Join the Movement</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
