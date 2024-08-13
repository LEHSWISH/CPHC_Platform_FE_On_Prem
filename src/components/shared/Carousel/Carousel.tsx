import { useEffect, useState } from 'react';
import './Carousel.scss'

interface  slides   {slides : string[]}
const Carousel = ({ slides  }: slides) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentSlide]);

  return (
    <div className="carousel">
      {/* <button onClick={prevSlide}>Previous</button> */}
      <div className="slide">
        <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} />
      </div>
      {/* <button onClick={nextSlide}>Next</button> */}
    </div>
  );
};

export default Carousel;
