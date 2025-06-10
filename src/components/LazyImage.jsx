// components/LazyImage.jsx
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Image, Loader, Center } from "@mantine/core";

const LazyImage = ({ src, alt, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div ref={ref} style={{ minHeight: 200, position: "relative" }}>
            {inView ? (
                <>
                    {!loaded && (
                        <Center style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                            <Loader size="sm" />
                        </Center>
                    )}
                    <Image
                        src={src}
                        alt={alt}
                        onLoad={() => setLoaded(true)}
                        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
                        {...props}
                    />
                </>
            ) : (
                <div style={{ height: 200, backgroundColor: "#f0f0f0" }} />
            )}
        </div>
    );
};

export default LazyImage;
