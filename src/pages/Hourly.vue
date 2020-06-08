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
          </q-form>
        </q-card-section>
      </q-card>
      <q-card class="col-auto self-center q-gutter-md">
        <q-card-section v-show="totalCost">
          <p>
            <u>Your</u> hourly rate: <em>{{ money(hourlyRate) }}</em>
          </p>
          <p>
            <u>Your</u> Estimated estimate: <em>{{ hours(estimatedEstimate) }}</em>.
          </p>
          <p>
            Total billable cost: <strong>{{ money(totalCost) }}</strong> ({{ money(totalNetCost) }} net)
          </p>
          <p>
            <u>Your</u> completion range:
            <q-badge color="secondary" text-color="black"
              >{{ completionRange.min }} - {{ weeks(completionRange.max) }}</q-badge
            >
            &nbsp;
            <q-badge
              >{{ completionRangeInMonths.min }} - {{ months(completionRangeInMonths.max) }}</q-badge
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

export default {
  data() {
    return {
      multipliers: [1, 1.3, 1.5, 2, 3, 4],
      feeMultiplier: 1.5,
      estimationMultiplier: 1.3,
      hourlyWage: 11.77, //8.2,
      timeEstimate: 160, //0,
      hoursPerWeek: 5, //0,
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
    totalCost() {
      return this.estimatedEstimate * this.hourlyRate;
    },
    totalNetCost() {
      return this.estimatedEstimate * this.hourlyRate * 0.8;
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
      return gbpForm.format(data)
    },
    hours(data) {
      return hrForm.format(data)
    },
    weeks(data) {
      return wkForm.format(data)
    },
    months(data) {
      return moForm.format(data)
    }
  }
};
</script>

<style></style>
