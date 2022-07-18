# PRIMA

Repository for the module "Prototyping interactive media-applications and games" at Furtwangen University

## Final Assignment: EndlessMatrixRunnerSoSe2022

- Title: EndlessMatrixRunnerSoSe2022
- Author: Umberto Falkenhagen
- Year and season: SoSe 2022
- Curriculum and semester: MIB7
- Course this development was created in: PRIMA
- Docent: Prof. Dipl.-Ing. Jirka R. Dell'Oro-Friedl, HFU
- Link to the Game: [EndlessMatrixRunner](https://umbertofalkenhagen.github.io/Prima/projects/EndlessMatrixRunnerSoSe22/index.html)
- Link to the source code: [Code](https://github.com/UmbertoFalkenhagen/Prima/tree/master/projects/EndlessMatrixRunnerSoSe22)
- Link to the design document: [Design](https://github.com/UmbertoFalkenhagen/Prima/blob/master/projects/EndlessMatrixRunnerSoSe22/Konzept_Endabgabe_EndlessRunner.pdf)
- Description for users on how to interact: Click on dialog window to start, use Space to start running, jump (while grounded) and drop (while mid-air)

### Checklist

|  Nr | Criterion           | Explanation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --: | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   1 | Units and Positions | - 0: at the players starting position <br> - Game is in 2.5D, agent runs on x/y-axis <br> - 1: Agent is 2 meters in height, 1 meters in width |
|   2 | Hierarchy           | SceneGraph <br> - Player Agent <br> - Floor Elements <br> -- FloorElement(1) <br> -- FloorElement(2) <br> -- FloorElement(x) <br> - Obstacles <br> -- ObstaclePlatforms <br> --- ObstaclePlatform(1) <br> ---- Coin(1) <br> --- ObstaclePlatform(2) <br> --- ObstaclePlatform(x) <br> - Enemies <br> -- Enemy(1) <br> -- Enemy(2) |
|   3 | Editor              | Created in Editor: Materials, Meshes, PrefabGraphs, Internal Resources in general |
|   4 | Scriptcomponents    | - Different behaviour e.g. <br> - PlayerMovement,<br> - CameraScript,<br> - Coin Rotator,<br> - PlatformRemover,<br> - PlatformSpawnerScript,<br> - GroundControllerScript |
|   5 | Extend              | Extend Node: <br> - Agent <br> - Coin <br> - Enemy <br> - ObstaclePlatform <br> - FloorElement <br> - PlatformSpawner <br> Extend Mutable: <br> - GameState |
|   6 | Sound               | - Backgroundmusic,<br> - Jump,<br> - Drop,<br> - Die,<br> - Enemy,<br> - Coin collected|
|   7 | VUI                 | Interface shows all important infos: <br> - Score <br> - Coins |
|   8 | Event-System        | Events when:<br> - collecting coins,<br> - running into an obstacle,<br> - enemy attacks |
|   9 | External Data       | - configuration.json allows to set:<br> - player speed,<br> - background music volume,<br> - sound effects volume,<br> - platforms with/without obstacles attached |
|   A | Light               | Since this game is 2.5D I decided to go with just one constant <br> ambient light in order to have a consistent environment and <br>avoid confusion during fast actions |
|   B | Physics             | - Rigidbodies used for: Agent, Floor/Platform elements, Enemies <br> - Rigibodies that are triggers: Coins |
|   C | Net                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|   D | State Machines      | - ComponentStateMachine used for enemies |
|   E | Animation           |  |
|     |