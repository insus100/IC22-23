class KMeans {
    constructor(x, v, b, epsilon, clases) {
      this.x = x; // muestras
      this.v = v; // centros
      this.n = x[0].length; // numero de muestras
      this.c = clases; // numero de clases
      this.b = b;
      this.epsilon = epsilon;
    }
  
    _d(i, j) {
      let sum = 0;
      for (let k = 0; k < this.x.length; k++) {
        sum += Math.pow(this.x[k][j] - this.v[i][k], 2);
      }
      return sum;
    }
  
    _p(i, j) {
      const exp = 1 / (this.b - 1);
  
      const d = this._d(i, j);
      if (d == 0.0) {
        return 1.0;
      }
  
      let num = Math.pow(1 / d, exp);
      let den = 0;
      for (let r = 0; r < this.c; r++) {
        den += Math.pow(1 / this._d(r, j), exp);
      }
      return num / den;
    }
  
    calculate() {
      console.log("==========");
      while (true) {
        let u = new Array(this.c)
          .fill(0)
          .map(() => new Array(this.n).fill(0));
        let new_v = new Array(this.c).fill(0).map(() => new Array(this.x.length).fill(0));
  
        for (let i = 0; i < this.c; i++) {
          let num = new Array(this.x.length).fill(0);
          let den = 0;
          for (let j = 0; j < this.n; j++) {
            let p = this._p(i, j);
            u[i][j] = p;
            let aux = Math.pow(p, this.b);
            for (let k = 0; k < this.x.length; k++) {
              num[k] += aux * this.x[k][j];
            }
            den += aux;
          }
          for (let k = 0; k < this.x.length; k++) {
            new_v[i][k] = num[k] / den;
          }
        }
  
        let max_delta = 0;
        for (let i = 0; i < this.c; i++) {
          let delta = 0;
          for (let k = 0; k < this.x.length; k++) {
            delta += Math.pow(this.v[i][k] - new_v[i][k], 2);
          }
          delta = Math.sqrt(delta);
          console.log(`delta: ${delta}`);
          max_delta = Math.max(max_delta, delta);
        }
        console.log(
          `centros:\n${JSON.stringify(this.v)}\n` +
          `nuevos centros:\n${JSON.stringify(new_v)}\n` +
          `matriz de pertenencia:\n${JSON.stringify(u)}\n` +
          `delta:\n${max_delta}\n` +
          `${"-".repeat(10)}`
        );
  
        this.v = new_v;
        if (max_delta <= this.epsilon) {
          return this.v;
        }
        // else {
        //   let s = prompt("delta > epsilon. Enter para seguir... Q para salir");
        //   if (s && s.toLowerCase() == "q") {
        //     break;
        //   }
        // }
      }
    }
}