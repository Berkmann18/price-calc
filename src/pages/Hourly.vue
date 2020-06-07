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
              suffix="h"
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
              suffix="h"
              label="Hours Per Week (to dedicate)"
              :rules="fillingRule"
            />
          </q-form>
        </q-card-section>
      </q-card>
      <q-card class="col-auto self-center q-gutter-md">
        <q-card-section v-show="totalCost">
          <p>
            Your hourly rate: <em>£ {{ hourlyRate }}</em>
          </p>
          <p>
            Your Estimated estimate: <em>{{ estimatedEstimate }} h</em>.
          </p>
          <p>
            Total cost: <strong>£ {{ totalCost }}</strong> (£ {{ totalNetCost }} net)
          </p>
          <p>
            Your completion range:
            <q-badge color="secondary" text-color="black"
              >{{ completionRange.min }} - {{ completionRange.max }} weeks</q-badge
            >
            &nbsp;
            <q-badge
              >{{ completionRangeInMonths.min }} - {{ completionRangeInMonths.max }} months</q-badge
            >
          </p>
        </q-card-section>
      </q-card>
    </section>
  </q-page>
</template>

<script>
import prettify from 'pretty-num';

const PN_CONFIG = { precision: 2, thousandsSeparator: ',' };

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
      return prettify(this.feeMultiplier * this.hourlyWage, PN_CONFIG);
    },
    estimatedEstimate() {
      return prettify(this.estimationMultiplier * this.timeEstimate, PN_CONFIG);
    },
    totalCost() {
      return prettify(this.estimatedEstimate * this.hourlyRate, PN_CONFIG);
    },
    totalNetCost() {
      return prettify(this.estimatedEstimate * this.hourlyRate * .8, PN_CONFIG);
    },
    completionRange() {
      return {
        min: prettify(this.timeEstimate / this.hoursPerWeek, PN_CONFIG),
        max: prettify(this.estimatedEstimate / this.hoursPerWeek, PN_CONFIG)
      };
    },
    completionRangeInMonths() {
      const cr = this.completionRange;
      return {
        min: prettify(cr.min / 4, PN_CONFIG),
        max: prettify(cr.max / 4, PN_CONFIG)
      };
    }
  }
};
</script>

<style></style>
