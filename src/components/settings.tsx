import {useState, useEffect} from 'react';

export default function Settings() {

  const [show, setShow] = useState<boolean>(false);

  const handleClick_settings = ( () => {
    console.log("Button clicked!")
    setShow(!show)
  })

  const handleClick_overlay = ( () => {
    console.log("Overlay clicked!")
    setShow(false)
  })

  // Run once
  useEffect(() => {
    console.log(show)
  }, [])

  useEffect(() => {
    console.log("Show changed: " + show)
  }, [show])

  return (
    <div className="settings">
      
      <button
        title="Settings" 
        onClick={handleClick_settings} 
      />

      {
        show && (
          <>
            <div 
              className="overlay"
              onClick={handleClick_overlay}
            />
            <div
              className="popup"
            >
              <h1>Settings</h1>
              <p>Difficulty</p>
            </div>
          </>
        )
      }
     
    </div>
  );
}