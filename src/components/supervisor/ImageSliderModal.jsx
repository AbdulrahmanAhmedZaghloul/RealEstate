import { useState } from 'react';
import { Modal } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import classes from "../../styles/contractDetails.module.css";

const ImageSliderModal = ({ images }) => {
  const [opened, setOpened] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openModal = (index) => {
    setActiveIndex(index);
    setOpened(true);
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="lg"
        centered
        title="Photos"
      >
        <Carousel
          initialSlide={activeIndex}
          withIndicators
          height={400}
        >
          {images.map((img, index) => (
            <Carousel.Slide key={index}>
              <img
                src={img.url}
                alt={`slide-${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Modal>

      {/* الصور المصغرة */}
      <div className={classes.positionGrid}>
        <div className={classes.positionGridCol}>
          <div
            className={classes.positionStar}
            onClick={() => openModal(0)}
          >
            <img
              className={classes.imageStar}
              src={images[0].url}
              alt="image"
            />
            <span className={classes.SeeStar}>View Photos</span>
          </div>
        </div>

        <div className={classes.imageStarSpan}>
          {images.slice(1).map((img, index) => (
            <img
              key={index + 1}
              src={img.url}
              alt={`image-${index + 1}`}
              onClick={() => openModal(index + 1)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>
    </>
  );
};
