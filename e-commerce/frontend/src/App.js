import Header from './layouts/Header';
import './assets/sass/app.scss';
import Footer from './layouts/Footer';
import Main from './layouts/Main';
import ChatBot from './layouts/ChatBot'; // Import ChatBot từ thư mục layouts

function App() {
  return (
    <div>
      <Header />
      <Main />
      <ChatBot />  {/* Thêm ChatBot ở đây */}
      <Footer />
    </div>
  );
}

export default App;
