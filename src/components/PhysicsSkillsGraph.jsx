import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export default function PhysicsSkillsGraph() {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const container = sceneRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Setup Matter.js Engine and World
    const Engine = Matter.Engine,
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
    engine.gravity.y = 0.05;
    engine.gravity.x = 0;

    // Handle high DPI displays for crisp rendering
    const pixelRatio = window.devicePixelRatio || 1;
    let width = container.clientWidth;
    let height = 450;
    
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);

    // 3. Define Skills
    const skills = [
      { name: "React", color: "#61DAFB", size: 45 },
      { name: "Node.js", color: "#339933", size: 40 },
      { name: "MongoDB", color: "#47A248", size: 40 },
      { name: "Framer", color: "#FF0055", size: 35 },
      { name: "Tailwind", color: "#06B6D4", size: 35 },
      { name: "GSAP", color: "#88CE02", size: 35 },
      { name: "Vite", color: "#646CFF", size: 30 },
      { name: "TypeScript", color: "#3178C6", size: 40 },
      { name: "Three.js", color: "#ffffff", size: 35 }
    ];

    const centerX = width / 2;
    const centerY = height / 2;

    // 4. Create the Central Core Node (Fixed)
    const coreNode = Bodies.circle(centerX, centerY, 60, {
      isStatic: true,
      plugin: { isCore: true, name: "CORE", color: "#00f7ff", size: 60 }
    });

    const bodies = [coreNode];
    const constraints = [];

    // 5. Create Skill Orbs and attach them to the Core with elastic springs
    skills.forEach((skill, i) => {
      const angle = (i / skills.length) * Math.PI * 2;
      const dist = 140 + Math.random() * 40;
      const startX = centerX + Math.cos(angle) * dist;
      const startY = centerY + Math.sin(angle) * dist;

      const node = Bodies.circle(startX, startY, skill.size, {
        restitution: 0.9, // Bouncy
        frictionAir: 0.04, // Slow down when thrown
        plugin: { name: skill.name, color: skill.color, size: skill.size }
      });
      bodies.push(node);

      // Elastic constraint (Spring)
      const spring = Constraint.create({
        bodyA: coreNode,
        bodyB: node,
        stiffness: 0.015, // Elasticity
        damping: 0.05,
        plugin: { color: "rgba(0, 247, 255, 0.3)" }
      });
      constraints.push(spring);

      // Inter-node constraints (connect adjacent nodes to form a web)
      if (i > 0) {
        const prevNode = bodies[bodies.length - 2];
        const webSpring = Constraint.create({
          bodyA: prevNode,
          bodyB: node,
          stiffness: 0.005,
          plugin: { color: "rgba(255, 48, 108, 0.15)" }
        });
        constraints.push(webSpring);
      }
    });

    // Close the web
    if (skills.length > 1) {
      const firstNode = bodies[1];
      const lastNode = bodies[bodies.length - 1];
      const closeSpring = Constraint.create({
        bodyA: lastNode,
        bodyB: firstNode,
        stiffness: 0.005,
        plugin: { color: "rgba(255, 48, 108, 0.15)" }
      });
      constraints.push(closeSpring);
    }

    World.add(world, [...bodies, ...constraints]);

    // 6. Add Boundaries
    const wallOptions = { isStatic: true };
    World.add(world, [
      Bodies.rectangle(centerX, -50, width + 200, 100, wallOptions),
      Bodies.rectangle(centerX, height + 50, width + 200, 100, wallOptions),
      Bodies.rectangle(-50, centerY, 100, height + 200, wallOptions),
      Bodies.rectangle(width + 50, centerY, 100, height + 200, wallOptions)
    ]);

    // 7. Add Mouse Interaction
    const mouse = Mouse.create(canvas);
    // Fix mouse scaling for high DPI displays
    Mouse.setScale(mouse, { x: 1, y: 1 });
    
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    World.add(world, mouseConstraint);

    // 8. Custom Render Loop (Bypasses the ugly Matter.Render)
    let animationFrameId;
    const renderLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw Grid Background for Technical Aesthetic
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += 40) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
      for (let y = 0; y <= height; y += 40) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
      ctx.stroke();

      // Draw Constraints (Laser Strings)
      ctx.lineWidth = 1.5;
      constraints.forEach(c => {
        const bodyA = c.bodyA;
        const bodyB = c.bodyB;
        if (!bodyA || !bodyB) return;
        
        ctx.beginPath();
        ctx.moveTo(bodyA.position.x, bodyA.position.y);
        ctx.lineTo(bodyB.position.x, bodyB.position.y);
        ctx.strokeStyle = c.plugin.color;
        // Add subtle glow
        ctx.shadowBlur = 5;
        ctx.shadowColor = c.plugin.color;
        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      });

      // Draw Bodies (Orbs)
      bodies.forEach(body => {
        const { x, y } = body.position;
        const plugin = body.plugin;
        if (!plugin) return; // Skip walls

        const isCore = plugin.isCore;
        const size = plugin.size;
        const color = plugin.color;

        // Outer Glow
        ctx.shadowBlur = isCore ? 30 : 15;
        ctx.shadowColor = color;

        // Fill background
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = isCore ? 'rgba(1, 3, 9, 0.9)' : 'rgba(10, 12, 22, 0.85)';
        ctx.fill();

        // Stroke border
        ctx.lineWidth = isCore ? 3 : 2;
        ctx.strokeStyle = color;
        ctx.stroke();
        
        // Reset shadow for text
        ctx.shadowBlur = 0;

        // Text
        ctx.font = isCore 
          ? 'bold 16px "JetBrains Mono", monospace' 
          : `600 ${size * 0.35}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = isCore ? '#00f7ff' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(plugin.name, x, y);
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    // 9. Run the engine and renderer
    const runner = Runner.create();
    Runner.run(runner, engine);
    renderLoop();

    // Resize handler
    const handleResize = () => {
      width = container.clientWidth;
      height = 450;
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(pixelRatio, pixelRatio);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      Runner.stop(runner);
      World.clear(world);
      Engine.clear(engine);
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <div 
        ref={sceneRef} 
        style={{ 
          width: '100%', 
          height: '450px', 
          background: '#010309', // Deep dark blue/black background
          borderRadius: '16px',
          border: '1px solid rgba(0, 247, 255, 0.15)',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4), inset 0 0 40px rgba(0, 247, 255, 0.05)',
        }}
      >
        <canvas ref={canvasRef} style={{ display: 'block', cursor: 'grab' }} />
      </div>
      
      {/* Premium HUD Overlay */}
      <div style={{
        position: 'absolute',
        top: 20, left: 24,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ width: '8px', height: '8px', background: '#00f7ff', borderRadius: '50%', boxShadow: '0 0 10px #00f7ff' }} />
          Interactive Physics Graph
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'rgba(0, 247, 255, 0.8)',
          margin: 0
        }}>
          [ Click & Drag to Interact ]
        </p>
      </div>
    </div>
  );
}
