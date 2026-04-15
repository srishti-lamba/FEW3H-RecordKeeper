import React, {useEffect, useRef, useState} from 'react';
import { MRT_Row, MRT_RowSelectionState, MRT_TableInstance } from 'material-react-table';
import { SplitPane, Pane } from 'react-split-pane';
import Settings from './components/settings/settings';
import Table, { BattleRow } from './components/table';
import './App.css';
import allChapters from './db/chapters.json';
import allBattles from './db/battles.json';
import { Details } from './components/details/details';
import { PixelsToSVG } from './components/pixel-art-to-svg';
import { DatabaseContext, DifficultyContext, BattlesTableContext } from './context';
import { MapIcons } from './components/data-classes/map-icon-data';
import { Items } from './components/data-classes/item-data';
import { Classes } from './components/data-classes/class-data';
import { Crests } from './components/data-classes/crest-data';
import { Weapons } from './components/data-classes/weapon-data';

function App() {

  // Run once
  useEffect(() => {

    // ["blue", "green", "red", "yellow"].forEach( 
    //   (colour) => {
    //     PixelsToSVG(colour + ".png"); 
    //     PixelsToSVG(colour + "-f.png");
    // })
    // PixelsToSVG("");
    Classes.createData()
    MapIcons.createData()
    Weapons.createData()
    Items.createData()
    Crests.createData()
  }, [])

  return (
    <DatabaseContext value={{chapters:allChapters, battles:allBattles.slice(1)}}><DifficultyContext value={useState<number>(1)}>
      <div className="App">
        <header className="App-header">
        Test test
        </header>
        <Settings
          // allChapters={allChapters}
          // difficulty={difficulty} setDifficulty={setDifficulty}
        />

        <BattlesTableContext value={{
          table: useRef<MRT_TableInstance<BattleRow>>(undefined),
          selectedRow: useState<MRT_RowSelectionState>({})
        }}>
          <SplitPane direction="horizontal" resizable={true}>
            <Pane minSize="200px" defaultSize="30%">
              <Table
                // allMissions={allMissions}
                // allChapters={allChapters}
                // difficulty={difficulty}
                // selectedRow={selectedRow}
                // setSelectedRow={setSelectedRow}
                // selectedRowData={selectedRowData}
              />
            </Pane>
            <Pane>
              <Details /*selectedRow={selectedRow} selectedRowData={selectedRowData}*/ />
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
              <symbol>
                <path 
                  id="row-left-edge" 
                  d="M 6 0 l -0.756 0.551 c -1.599 1.049 -1.905 1.966 -1.908 5.71 l -0.127 2.739 c -4.209 4 -4.209 13 0.166 17 l -0.022 3 c -0.03 3.54 0.254 4.421 1.814 5.566 l 0.833 0.434" 
                />
              </symbol>
            </defs>
          </svg>
        </BattlesTableContext>
      </div>
    {/* </Difficulty></AllChapters></AllBattles> */}
    </DifficultyContext></DatabaseContext>
  );
}

export default App;
