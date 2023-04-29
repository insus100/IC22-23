class KMeans {
    constructor(x, v, b, epsilon, clases) {
      this.x = math.matrix(x);  // muestras
      this.v = math.matrix(v);  // centros
      this.n = this.x.size()[1];  // numero de muestras
      this.c = clases;  // numero de clases
      this.b = b;
      this.epsilon = epsilon;
    }
  
    _d(i, j) {
        let sum = 0;
        for (let k = 0; k < this.x.length; k++) {
          sum += Math.pow(this.x[k][j] - this.v[i][j], 2);
        }
        return sum;
      }
  
    _p(i, j) {
      const exp = 1 / (this.b - 1);
  
      const d = this._d(i, j);
      if (d === 0.0) {
        return 1.0;
      }
  
      let num = math.pow(1 / d, exp);
      let den = 0;
      for (let r = 0; r < this.c; r++) {
        den += math.pow(1 / this._d(r, j), exp);
      }
      return num / den;
    }
  
    calculate() {
      console.log("==========");
      while (true) {
        let u = math.zeros([this.c, this.n]);
        let new_v = math.zeros([this.c, this.x.size()[0]]);
        for (let i = 0; i < this.c; i++) {
          let num = math.zeros([this.x.size()[0]]);
          let den = 0;
          for (let j = 0; j < this.n; j++) {
            let p = this._p(i, j);
            u.subset(math.index(i, j), p);
            let aux = math.pow(p, this.b);
            num = math.add(num, math.dotMultiply(aux, this.x.subset(math.index(math.range(), j))));
            den += aux;
          }
          new_v.subset(math.index(i, math.range()), math.divide(num, den));
        }
  
        let max_delta = 0.0;
        for (let i = 0; i < this.c; i++) {
          let delta = math.sqrt(math.sum(math.square(math.subtract(this.v.subset(math.index(i, math.range())), new_v.subset(math.index(i, math.range()))))));
          console.log(`delta: ${delta}`);
          max_delta = math.max(max_delta, delta);
        }
        console.log(`centros:\n${this.v}\n`
                    + `nuevos centros:\n${new_v}\n`
                    + `matriz de pertenencia:\n${u}\n`
                    + `delta:\n${max_delta}\n`
                    + `${"-".repeat(10)}`);
  
        this.v = new_v;
        if (max_delta <= this.epsilon) {
          return this.v;
        }
      }
    }
  }