import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export default function PhysicsSkillsGraph() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);

  useEffect(() => {
    const container = sceneRef.current;
    if (!container) return;

    // 1. Setup Matter.js Engine and World
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          MouseConstraint = Matter.MouseConstraint,
          Mouse = Matter.Mouse,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Constraint = Matter.Constraint;

    const engine = Engine.create();
    const world = engine.world;
    engineRef.current = engine;
    
    // Lower gravity for a floating "space" feel
    engine.gravity.y = 0.1;

    // 2. Setup Custom Renderer (We use Matter's built-in canvas but heavily style it)
    const render = Render.create({
      element: container,
      engine: engine,
      options: {
        width: container.clientWidth,
        height: 400,
        background: 'transparent',
        wireframes: false, // Turn off wireframes so we can use custom colors
        pixelRatio: window.devicePixelRatio
      }
    });
    renderRef.current = render;

    // 3. Define Skills
    const skills = [
      { name: "React", color: "#61DAFB", size: 40 },
      { name: "Node.js", color: "#339933", size: 35 },
      { name: "MongoDB", color: "#47A248", size: 35 },
      { name: "Framer", color: "#FF0055", size: 30 },
      { name: "Tailwind", color: "#06B6D4", size: 30 },
      { name: "GSAP", color: "#88CE02", size: 30 },
      { name: "Vite", color: "#646CFF", size: 25 },
      { name: "TypeScript", color: "#3178C6", size: 35 },
      { name: "Three.js", color: "#ffffff", size: 30 }
    ];

    const centerX = container.clientWidth / 2;
    const centerY = 200;

    // 4. Create the Central Core Node (Fixed)
    const coreNode = Bodies.circle(centerX, centerY, 50, {
      isStatic: true,
      render: {
        fillStyle: '#010309',
        strokeStyle: '#00f7ff',
        lineWidth: 3
      }
    });

    const bodies = [coreNode];
    const constraints = [];

    // 5. Create Skill Orbs and attach them to the Core with elastic springs
    skills.forEach((skill, i) => {
      const angle = (i / skills.length) * Math.PI * 2;
      const dist = 120 + Math.random() * 60;
      const startX = centerX + Math.cos(angle) * dist;
      const startY = centerY + Math.sin(angle) * dist;

      const node = Bodies.circle(startX, startY, skill.size, {
        restitution: 0.8, // Bouncy
        frictionAir: 0.05, // Slow down when thrown
        render: {
          fillStyle: '#0a0c16',
          strokeStyle: skill.color,
          lineWidth: 2
        }
      });
      
      // Store the name in the body so we can draw it later
      node.plugin = { name: skill.name, color: skill.color, size: skill.size };
      bodies.push(node);

      // Elastic constraint (Spring)
      const spring = Constraint.create({
        bodyA: coreNode,
        bodyB: node,
        stiffness: 0.02, // Elasticity
        damping: 0.05,
        render: {
          strokeStyle: 'rgba(0, 247, 255, 0.2)',
          lineWidth: 1
        }
      });
      constraints.push(spring);

      // Inter-node constraints (connect adjacent nodes to form a web)
      if (i > 0) {
        const prevNode = bodies[bodies.length - 2];
        const webSpring = Constraint.create({
          bodyA: prevNode,
          bodyB: node,
          stiffness: 0.01,
          render: {
            strokeStyle: 'rgba(255, 48, 108, 0.15)',
            lineWidth: 1
          }
        });
        constraints.push(webSpring);
      }
    });

    // Close the web (connect last node to first skill node)
    if (skills.length > 1) {
      const firstNode = bodies[1];
      const lastNode = bodies[bodies.length - 1];
      const closeSpring = Constraint.create({
        bodyA: lastNode,
        bodyB: firstNode,
        stiffness: 0.01,
        render: {
          strokeStyle: 'rgba(255, 48, 108, 0.15)',
          lineWidth: 1
        }
      });
      constraints.push(closeSpring);
    }

    World.add(world, [...bodies, ...constraints]);

    // 6. Add Boundaries (Walls, Floor, Ceiling)
    const wallOptions = { isStatic: true, render: { visible: false } };
    World.add(world, [
      Bodies.rectangle(centerX, -50, container.clientWidth + 200, 100, wallOptions), // Ceiling
      Bodies.rectangle(centerX, 450, container.clientWidth + 200, 100, wallOptions), // Floor
      Bodies.rectangle(-50, centerY, 100, 500, wallOptions), // Left Wall
      Bodies.rectangle(container.clientWidth + 50, centerY, 100, 500, wallOptions) // Right Wall
    ]);

    // 7. Add Mouse Interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    World.add(world, mouseConstraint);
    
    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // 8. Custom drawing for text on the orbs using Matter.Events
    Matter.Events.on(render, 'afterRender', function() {
      const context = render.context;
      
      bodies.forEach((body) => {
        if (body.isStatic) {
          // Draw CORE text
          context.font = 'bold 16px "JetBrains Mono", monospace';
          context.fillStyle = '#00f7ff';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText('CORE', body.position.x, body.position.y);
          return;
        }

        if (body.plugin && body.plugin.name) {
          context.font = `600 ${body.plugin.size * 0.4}px "Plus Jakarta Sans", sans-serif`;
          context.fillStyle = body.plugin.color;
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(body.plugin.name, body.position.x, body.position.y);
        }
      });
    });

    // 9. Run the engine and renderer
    Runner.run(Runner.create(), engine);
    Render.run(render);

    // Cleanup
    return () => {
      Render.stop(render);
      World.clear(world);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <div 
        ref={sceneRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          background: 'var(--bg-section)',
          borderRadius: '16px',
          border: '1px solid var(--border-glass)',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2), inset 0 0 20px rgba(0, 247, 255, 0.05)',
          cursor: 'grab'
        }}
      />
      <div style={{
        position: 'absolute',
        top: 16, left: 24,
        pointerEvents: 'none'
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          margin: 0
        }}>
          Interactive Physics Graph
        </p>
        <p style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.85rem',
          color: '#00f7ff',
          margin: '4px 0 0 0'
        }}>
          [ Grab & throw the nodes ]
        </p>
      </div>
    </div>
  );
}
