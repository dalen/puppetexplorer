export const eventList = {
  bindings: {
    query: '<',
  },

  template: `
    <div class="alert alert-warning" role="alert" ng-if="$ctrl.events.length === 0">
      No matching events found
    </div>

    <table class="table table-hover" ng-if="$ctrl.events.length > 0">
      <thead><tr>
        <th>Node</th>
        <th>Type</th>
        <th>Title</th>
        <th>Property</th>
        <th>From</th>
        <th>To</th>
      </tr></thead>
      <tbody ng-repeat="event in $ctrl.events">
        <tr ng-class="$ctrl.color(event.status)" ng-click="$ctrl.toggleRow(event)">
          <td>{{event.certname}}</td>
          <td>{{event.resource_type}}</td>
          <td>{{event.resource_title}}</td>
          <td>{{event.property}}</td>
          <td>{{event.old_value}}</td>
          <td>{{event.new_value}}</td>
        </tr>
        <tr>
          <td class="reveal-animation" ng-if="event.show" colspan="6">
            <table class="table">
              <tr>
                <th>Message</th>
                <td>{{event["message"]}}</td>
              </tr>
              <tr>
                <th>Containing-class</th>
                <td>{{event.containing_class}}</td>
              </tr>
              <tr>
                <th>Containment-path</th>
                <td>
                  <ol class="breadcrumb">
                    <li ng-repeat="container in event.containment_path">{{container}}</li>
                  </ol>
                </td>
              </tr>
              <tr>
                <th>File</th>
                <td>
                  {{event["file"]}}<span ng-if="event.file && event.line">:</span>{{event["line"]}}
                </td>
              </tr>
              <tr>
                <th>Timestamp</th>
                <td title="{{event.timestamp}}" am-time-ago="event.timestamp"></td>
              </tr>
              <tr ng-click="$ctrl.selectReport(event.report)">
                <th>Report</th>
                <td>{{event.report}}</td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
    </table>

    <pagination ng-if="$ctrl.numItems > $ctrl.perPage"
      ng-change="$ctrl.fetchEvents()" ng-model="$ctrl.page"
      num-pages="$ctrl.numPages" items-per-page="$ctrl.perPage"
      boundary-links="$ctrl.numItems > $ctrl.perPage*5" max-size="5" total-items="$ctrl.numItems"
      rotate="false" previous-text="&lsaquo;" next-text="&rsaquo;"
      first-text="&laquo;" last-text="&raquo;">
  `,

  controller: class {
    constructor(puppetDB) {
      this.puppetDB = puppetDB;

      this.page = this.page || 1;
      this.perPage = 50;
      this.numItems = undefined;
      this.fetchEvents();
    }

    // Return the CSS class event states should correspond to
    //
    // status - The {String} event status
    //
    // Returns: A {String} with the CSS class
    color(status) {
      switch (status) {
        case 'success':
          return 'success';
        case 'noop':
          return 'text-muted';
        case 'failure':
          return 'danger';
        case 'skipped':
          return 'warning';
        default:
          return '';
      }
    }

    // Fetch the list of events for the currect page
    fetchEvents() {
      this.events = undefined;

      this.puppetDB.query('events',
        this.query,
        {
          offset: this.perPage * (this.page - 1),
          limit: this.perPage,
          order_by: JSON.stringify([{ field: 'timestamp', order: 'desc' }]),
        },
        (data, total) => {
          this.events = data;
          this.numItems = total;
        }
      );
    }
  },
};
