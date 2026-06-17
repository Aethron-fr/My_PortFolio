import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export default function PhysicsSandbox({ active, onClose }) {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    // module aliases
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    // create an engine
    const engine = Engine.create();
    engineRef.current = engine;

    // create a renderer
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent'
      }
    });
    renderRef.current = render;

    // create bodies
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true });
    const wallLeft = Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });
    const wallRight = Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, { isStatic: true });

    const shapes = [];
    const colors = ['#00f7ff', '#e1306c', '#fbbf24', '#7b2cbf'];
    
    for (let i = 0; i < 40; i++) {
      const size = Math.random() * 40 + 20;
      const x = Math.random() * window.innerWidth;
      const y = -Math.random() * window.innerHeight;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      let body;
      if (Math.random() > 0.5) {
        body = Bodies.rectangle(x, y, size, size, {
          render: { fillStyle: color, strokeStyle: '#ffffff', lineWidth: 2 },
          restitution: 0.8
        });
      } else {
        body = Bodies.circle(x, y, size / 2, {
          render: { fillStyle: color, strokeStyle: '#ffffff', lineWidth: 2 },
          restitution: 0.9
        });
      }
      shapes.push(body);
    }

    // add all of the bodies to the world
    Composite.add(engine.world, [ground, wallLeft, wallRight, ...shapes]);

    // add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Composite.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // run the renderer
    Render.run(render);

    // create runner
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    const handleResize = () => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 25 });
      Matter.Body.setPosition(wallRight, { x: window.innerWidth + 25, y: window.innerHeight / 2 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Matter.Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'auto' }}>
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          background: 'var(--accent-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          zIndex: 10000,
          fontFamily: 'var(--font-mono)'
        }}
      >
        EXIT GRAVITY
      </button>
      <div ref={sceneRef} />
    </div>
  );
}
