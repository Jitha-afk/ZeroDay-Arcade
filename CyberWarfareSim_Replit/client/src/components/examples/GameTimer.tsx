import GameTimer from '../GameTimer';

export default function GameTimerExample() {
  return (
    <div className="space-y-4 p-4 max-w-md">
      <GameTimer 
        duration={2700} // 45 minutes
        phase="simulation"
        onPhaseComplete={() => console.log('Simulation phase completed')}
      />
      <GameTimer 
        duration={600} // 10 minutes
        phase="debrief"
        onPhaseComplete={() => console.log('Debrief phase completed')}
      />
      <GameTimer 
        duration={0}
        phase="completed"
        onPhaseComplete={() => console.log('Game completed')}
      />
    </div>
  );
}