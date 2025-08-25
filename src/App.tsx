import Home from './sections/Home'
import Navbar from './sections/Navbar'
import BoardMembers from './sections/BoardMembers'
import AboutUs from './sections/AboutUs'
import Partnerships from './sections/Partnerships'
function App() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "70px" }}>
        <div id="home">
          <Home />
        </div>
        <div id="about">
          <AboutUs />
        </div>
        <div id="board">
          <BoardMembers />
        </div>
        <div id="partnerships">
          <Partnerships />
        </div>
        <div id="contact">
          {/* Contact content */}
        </div>
      </div>
    </>
  )
}

export default App
