<template>
  <q-page class="flex flex-center">
    <section class="fit row wrap justify-evenly items-center content-around">
      <q-card>
        <q-card-section>
          <q-form class="col-auto self-start q-gutter-md">
            <q-input
              v-model="hourlyWage"
              outlined
              type="number"
              prefix="£"
              label="(Current) Hourly Wage"
              :rules="minWageRule"
            />
            <q-select
              v-model="feeMultiplier"
              outlined
              :options="multipliers"
              label="Fee Multiplier"
              transition-show="scale"
              transition-hide="scale"
              prefix="x"
              :rules="fillingRule"
            />

            <q-input
              v-model="timeEstimate"
              outlined
              type="number"
              suffix="hrs"
              label="Time Estimate"
              :rules="fillingRule"
            />
            <q-select
              v-model="estimationMultiplier"
              outlined
              :options="multipliers"
              label="Estimation Multiplier"
              transition-show="scale"
              transition-hide="scale"
              prefix="x"
              :rules="fillingRule"
            />

            <q-input
              v-model="hoursPerWeek"
              outlined
              type="number"
              suffix="hrs"
              label="Hours Per Week (to dedicate)"
              :rules="fillingRule"
            />
            <q-select
              v-model="clientType"
              outlined
              :options="clientTypes"
              label="Who is it for?"
              transition-show="scale"
              transition-hide="scale"
              :rules="fillingRule"
            />
            <fieldset>
              <legend>Extras</legend>
              <q-toggle
                v-for="extra in extraServices"
                :key="extra.label"
                v-model="extra.enabled"
                color="primary"
                keep-color
              >
                <q-input
                  v-model="extra.value"
                  outlined
                  type="number"
                  prefix="£"
                  :label="extra.label"
                  :rules="fillingRule"
                  :dark="extra.enabled"
                  :bg-color="extra.enabled ? 'primary' : ''"
                />
              </q-toggle>
            </fieldset>

            <q-input
              v-model="margin"
              outlined
              type="number"
              suffix="%"
              label="Margin (if any)"
              :rules="fillingRule"
            />
          </q-form>
        </q-card-section>
      </q-card>
      <q-card class="col-auto self-center q-gutter-md">
        <q-card-section v-show="totalCost">
          <p>
            <u>Your</u> hourly rate: <em>{{ money(hourlyRate) }}</em>
          </p>
          <p>
            <u>Your</u> Estimated estimate: <em>{{ hours(estimatedEstimate) }}</em
            >.
          </p>
          <p>
            Total billable cost: <strong>{{ money(totalCost) }}</strong> ({{ money(totalNetCost) }}
            net)
          </p>
          <p>
            <u>Your</u> completion range:
            <q-badge color="secondary" text-color="black"
              >{{ completionRange.min }} - {{ weeks(completionRange.max) }}</q-badge
            >
            &nbsp;
            <q-badge
              >{{ completionRangeInMonths.min }} -
              {{ months(completionRangeInMonths.max) }}</q-badge
            >
          </p>
        </q-card-section>
      </q-card>
    </section>
  </q-page>
</template>

<script>
const gbpForm = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });
const hrForm = new Intl.NumberFormat('en-GB', { style: 'unit', unit: 'hour' });
const wkForm = new Intl.NumberFormat('en-GB', { style: 'unit', unit: 'week' });
const moForm = new Intl.NumberFormat('en-GB', { style: 'unit', unit: 'month' });

const CLIENT_TYPES = [
  {
    label: 'Individual',
    value: 1
  },
  {
    label: 'Team',
    value: 1.2
  },
  {
    label: 'Enterprise',
    value: 1.4
  }
];

export default {
  data() {
    return {
      multipliers: [1, 1.3, 1.5, 2, 3, 4],
      feeMultiplier: 1.5,
      estimationMultiplier: 1.3,
      hourlyWage: 11.77, //8.2,
      timeEstimate: 160, //0,
      hoursPerWeek: 5, //0,
      clientTypes: CLIENT_TYPES,
      clientType: CLIENT_TYPES[0],
      extraServices: [
        {
          label: 'Logo Design',
          value: 6.5,
          enabled: false
        },
        {
          label: 'UI Design',
          value: 8,
          enabled: false
        },
        {
          label: 'Hosting',
          value: 2,
          enabled: false
        },
        {
          label: 'Ads',
          value: 12,
          enabled: false
        },
        {
          label: 'Analytics',
          value: 1.5,
          enabled: false
        }
      ],
      margin: 0,
      fillingRule: [(val) => !!val || 'Field is required'],
      minWageRule: [(val) => val > 8.2 || 'This is lower minimum wage for your age group is £8.20!']
    };
  },
  computed: {
    hourlyRate() {
      return this.feeMultiplier * this.hourlyWage;
    },
    estimatedEstimate() {
      return this.estimationMultiplier * this.timeEstimate;
    },
    actualMargin() {
      return this.margin / 100;
    },
    totalCost() {
      const extras = this.extraServices
        .filter((extra) => extra.enabled)
        .reduce((sum, { value }) => sum + value, 0);
      const productionCost = this.estimatedEstimate * this.hourlyRate + extras;
      return productionCost * (1 + this.actualMargin) * this.clientType.value;
    },
    totalNetCost() {
      return this.totalCost * 0.8;
    },
    completionRange() {
      return {
        min: this.timeEstimate / this.hoursPerWeek,
        max: this.estimatedEstimate / this.hoursPerWeek
      };
    },
    completionRangeInMonths() {
      const cr = this.completionRange;
      return {
        min: cr.min / 4,
        max: cr.max / 4
      };
    }
  },
  methods: {
    money(data) {
      return gbpForm.format(data);
    },
    hours(data) {
      return hrForm.format(data);
    },
    weeks(data) {
      return wkForm.format(data);
    },
    months(data) {
      return moForm.format(data);
    }
  }
};
</script>
