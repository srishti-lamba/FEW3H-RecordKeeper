import React, {useEffect, useState} from 'react';
import { MRT_RowSelectionState } from 'material-react-table';
import { SplitPane, Pane } from 'react-split-pane';
import Settings from './components/settings';
import Table from './components/table';
import './App.css';
import allChapters from './db/chapters.json';
import allMissions from './db/missions.json';
import { Details } from './components/details';

function App() {

  const [difficulty, setDifficulty] = useState<number>(1);
  const [selectedRow, setSelectedRow] = useState<MRT_RowSelectionState>({});

  // Run once
  useEffect(() => {
    console.log("All Chapters:")
    console.log(allChapters)
    console.log("All Missions:")
    console.log(allMissions)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
      Test test
      </header>
      <Settings
        allChapters={allChapters}
        difficulty={difficulty} setDifficulty={setDifficulty}
      />

      <SplitPane direction="horizontal" resizable={true}>
        <Pane minSize="200px" defaultSize="70%">
          <Table
            allMissions={allMissions}
            allChapters={allChapters}
            difficulty={difficulty}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        </Pane>
        <Pane>
          <Details selectedRow={selectedRow} />
        </Pane>
      </SplitPane>

      <svg height="0" width="0">
        <defs>
          <clipPath id="three-diamonds-clip"  clipPathUnits="objectBoundingBox" preserveAspectRatio="xMidYMid meet">
            <path d="M 0 0.2595 L 0.1899 0.0696 L 0.3101 0.1899 L 0.5 0 L 0.6899 0.1899 L 0.8101 0.0696 L 1 0.2595 L 0.8101 0.4494 L 0.6899 0.3291 L 0.5 0.519 L 0.3101 0.3291 L 0.1899 0.4494 Z 
            M 0.2279 0.386 L 0.2975 0.3164 L 0.2405 0.2595 L 0.2975 0.2025 L 0.2279 0.1329 L 0.1013 0.2595 Z 
            M 0.3228 0.2025 L 0.3798 0.2595 L 0.3228 0.3164 L 0.5 0.4937 L 0.6772 0.3164 L 0.6203 0.2595 L 0.6772 0.2025 L 0.5 0.0254 L 0.3228 0.2025 Z 
            M 0.7025 0.3164 L 0.7722 0.386 L 0.8987 0.2595 L 0.7722 0.1329 L 0.7025 0.2025 L 0.7595 0.2595 L 0.7025 0.3164 Z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default App;
