export const beanMetric = {
  bindings: {
    bean: '@',
    name: '@',
    title: '@',
    multiply: '@?',
  },

  template: `
    <div class="panel panel-primary">
      <div class="panel-heading"><h3 class="panel-title">{{$ctrl.title}}</h3></div>
      <div class="panel-body"><span class="lead">
        <span ng-class="$ctrl.value ? '' : 'glyphicon glyphicon-refresh spin'">
          {{$ctrl.value}}
        </span>
      </span></div>
    </div>
  `,

  controller: class {
    constructor(puppetDB) {
      let multiply;
      if (!this.multiply) {
        multiply = 1;
      } else {
        multiply = Number.parseInt(this.multiply, 10);
      }
      puppetDB.getBean(`${this.bean}:name=${this.name}`).then(
        (resp) => {
          this.value = (resp.data.Value * multiply)
            .toLocaleString()
            .replace(/^(.*\..).*/, '$1');
        },
        (resp) => {
          if (resp.status !== 0) {
            throw new Error(`Could not fetch metric ${this.name} from puppetDB`);
          }
        }
      );
    }
  },
};
