import Welcome from './Welcome.jpg'; 

function Homepage() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh', 
  };

  const imageStyle = {
    maxWidth: '90%', 
    transform: 'scale(0.8)', // 缩小图像为原始大小的80%
  };


  return (
    <div style={containerStyle}>
      <img src={Welcome} alt="Shopee Background" style={imageStyle} />
      {/* 其他Homepage内容 */}
    </div>
  );
}

export default Homepage;