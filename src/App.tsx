import { useEffect } from 'react';
import { useRoute } from './lib/router';
import { Shell } from './components/Shell';
import { Home } from './pages/Home';
import { LearnIndex, ChapterView } from './pages/Learn';
import { Practice } from './pages/Practice';
import { Exam } from './pages/Exam';
import { Flashcards } from './pages/Flashcards';
import { Arcade } from './pages/Arcade';
import { MindMap } from './pages/MindMap';
import { Trophies } from './pages/Trophies';
import { bootCheck } from './lib/store';

export function App() {
  const route = useRoute();
  useEffect(() => { bootCheck(); }, []);

  let page;
  switch (route[0]) {
    case 'learn':
      page = route[1] ? <ChapterView ch={Number(route[1])} idx={Number(route[2] ?? 0)} /> : <LearnIndex />;
      break;
    case 'practice': page = <Practice key={route.join('/')} route={route} />; break;
    case 'exam': page = <Exam />; break;
    case 'cards': page = <Flashcards />; break;
    case 'arcade': page = <Arcade route={route} />; break;
    case 'map': page = <MindMap />; break;
    case 'trophies': page = <Trophies />; break;
    default: page = <Home />;
  }
  return <Shell route={route}>{page}</Shell>;
}
