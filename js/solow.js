(function () {
  
function simulateTransition(params, k0) {
  const T = 200;
  let k = k0;

  const kPath = [];
  const cPath = [];

  for (let t = 0; t < T; t++) {
    const y = Math.pow(k, params.alpha);
    const c = (1 - params.s) * y;

    kPath.push({ x: t, y: k });
    cPath.push({ x: t, y: c });

    const dk = params.s * y - (params.n + params.delta) * k;
    k = Math.max(k + dk, 1e-4);
  }

  return { kPath, cPath };
}

function generateSolowCurves(params) {
  const kMax = 10;
  const points = 50;

  const y = [];
  const sy = [];
  const breakeven = [];

  for (let i = 0; i <= points; i++) {
    const k = (kMax / points) * i;

    const output = Math.pow(k, params.alpha);
    y.push({ x: k, y: output });
    sy.push({ x: k, y: params.s * output });
    breakeven.push({ x: k, y: (params.n + params.delta) * k });
  }

  return { y, sy, breakeven };
}

function steadyState(params) {
  const kStar = Math.pow(
    params.s / (params.n + params.delta),
    1 / (1 - params.alpha)
  );
  const yStar = Math.pow(kStar, params.alpha);
  return { x: kStar, y: params.s * yStar };
}

  const ctx = document.getElementById("solowChart");
  if (!ctx) return; // safety for other pages

  const chart = new Chart(ctx, {
  type: "line",
  data: {
    datasets: [
      {
        label: "yₜ₊₁ = kₜ^α",
        data: [],
        borderColor: "#2563eb",
        borderWidth: 1,
        pointRadius: 0,
        parsing: false
      },
      {
        label: "s · yₜ",
        data: [],
        borderColor: "#16a34a",
        borderWidth: 2,
        pointRadius: 0,
        parsing: false
      },
      {
        label: "(n + δ)kₜ",
        data: [],
        borderColor: "#dc2626",
        borderDash: [6, 4],
        borderWidth: 2,
        pointRadius: 0,
        parsing: false
      }
    ]
  },
  options: {
    responsive: true,
    animation: false,
    scales: {
      x: {
        type: "linear",
        min: 0,
        max: 10,
        title: {
          display: true,
          text: "k (capital per worker)"
        }
      },
      y: {
        min: 0,
        max: 2,
        title: {
          display: true,
          text: "Output / Investment per worker"
        }
      }
    },
    plugins: {
      legend: {
        position: "top"
      }
    }
  }
});


const kCtx = document.getElementById("capitalChart");
const capitalChart = new Chart(kCtx, {
  type: "line",
  data: {
    datasets: [{
      label: "Capital per worker (kₜ)",
      data: [],
      borderColor: "#2563eb",
      borderWidth: 2,
      pointRadius: 0,
      parsing: false
    }]
  },
  options: {
    responsive: true,
    animation: false,
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: 150,
        title: { display: true, text: "Time" }
      },
      y: {
        min: 0,
        max: 10,
        title: { display: true, text: "k" }
      }
    }
  }
});


const cCtx = document.getElementById("consumptionChart");
const consumptionChart = new Chart(cCtx, {
  type: "line",
  data: {
    datasets: [{
      label: "Consumption per worker (cₜ=(1-s)yₜ)",
      data: [],
      borderColor: "#f97316",
      borderWidth: 2,
      pointRadius: 0,
      parsing: false
    }]
  },
  options: {
    responsive: true,
    animation: false,
    scales: {
      x: {
      type: 'linear',
      title: { display: true, text: "Time" },
      min: 0,
      max: 150,  // optional: max time for clarity
    },
      y: {
        min: 0,
        max: 4,
        title: { display: true, text: "c" }
      }
    }
  }
});


  function update() {
  const params = {
    s: +document.getElementById("s").value,
    n: +document.getElementById("n").value,
    delta: +document.getElementById("d").value,
    alpha: +document.getElementById("a").value
  };

  document.getElementById("s-val").textContent = params.s;
  document.getElementById("n-val").textContent = params.n;
  document.getElementById("d-val").textContent = params.delta;
  document.getElementById("a-val").textContent = params.alpha;

  const curves = generateSolowCurves(params);
  //const kStar = steadyState(params);
  const k0 = +document.getElementById("k0").value;
  document.getElementById("k0-val").textContent = k0.toFixed(2);
  
  // vertical line height = max of sy or y
  //const yMax = Math.max(
   // ...curves.y.map(p => p.y),
  //  ...curves.sy.map(p => p.y)
 // );

  chart.data.datasets[0].data = curves.y;
  chart.data.datasets[1].data = curves.sy;
  chart.data.datasets[2].data = curves.breakeven;
  //chart.data.datasets[3].data = steadyStateLine(kStarPoint.x, yMax);
  //chart.data.datasets[4].data = [kStarPoint];

  chart.update();
/*  
  const k0 = 0.2; // initial capital per worker*/

/*  const k0Input = document.getElementById("k0");
  const k0Val = document.getElementById("k0-val");
  
  if (k0Input && k0Val) {
    k0 = +k0Input.value;
    k0Val.textContent = k0.toFixed(2);
  }*/
  
  const transition = simulateTransition(params, k0);
  
  capitalChart.data.datasets[0].data = transition.kPath;
  consumptionChart.data.datasets[0].data = transition.cPath;
  
  capitalChart.update();
  consumptionChart.update();

}

  document.querySelectorAll(".solow-container input")
    .forEach(el => el.addEventListener("input", update));

  update();
})();
