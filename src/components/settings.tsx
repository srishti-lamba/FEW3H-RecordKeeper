import {useState, useEffect} from 'react';
import { DifficultyButtons } from './settings-difficulty';
import { ChapterSelection, RouteChapters } from './settings-chapters';

interface SettingsProps {
  allChapters : RouteChapters[];
  difficulty : number;
  setDifficulty : any;
}

export default function Settings({allChapters, difficulty, setDifficulty} : SettingsProps) {

  const [show, setShow] = useState<boolean>(true);

  // Chapters: Scarlet Blaze
  const [sbStart, setSbStart] = useState<number>(2);
  const [sbEnd, setSbEnd] = useState<number>(2);

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
    console.log("Show:" + show)
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
            <div className="popup">

              <h1>Settings</h1>
                <DifficultyButtons 
                    show={show} 
                    difficulty={difficulty} 
                    setDifficulty={setDifficulty} />
                <ChapterSelection
                    show={show}
                    // chapterStart={sbStart} setChapterStart={setSbStart}
                    // chapterEnd={sbEnd} setChapterEnd={setSbEnd}
                    allChapters={[allChapters[0], allChapters[1]]}/>
            </div>
          </>
        )
      }
     
    </div>
  );
}