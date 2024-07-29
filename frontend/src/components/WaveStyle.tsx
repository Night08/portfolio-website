import Wave from "react-wavify";

const WaveStyle = ({ side }: { side: string }) => {
  let transformStyle: {
    transform: string;
    transformOrigin: string;
    marginRight?: string;
    marginLeft?: string;
  };
  if (side === "right") {
    transformStyle = {
      transform: "rotate(-3deg)",
      transformOrigin: "right bottom",
      marginRight: "-40px",
    };
  } else {
    transformStyle = {
      transform: "rotate(3deg)",
      transformOrigin: "left bottom",
      marginLeft: "-40px",
    };
  }

  return (
    <>
      <div style={transformStyle} className="-my-4 overflow-x-hidden">
        <Wave
          fill="#fa9f69"
          paused={false}
          options={{
            height: 16,
            amplitude: 30,
            speed: 0.3,
            points: 4,
          }}
        />{" "}
      </div>
    </>
  );
};

export default WaveStyle;
