<template>
  <div class="seatplan" ref="root" :class="{ 'callout-active': calloutActive }">

    <div class="row q-col-gutter-lg">
      <div
        v-for="table in tables"
        :key="table.id"
        class="col-12 col-sm-6 col-md-4"
      >
        <q-card :class="['seat-card', 'text-dark', { 'has-current': hasCurrent(table) }]" data-sal="zoom-in" data-sal-duration="400">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6">{{ tName(table) }}</div>
            <q-badge outline color="primary">
              {{ (tGuests(table)?.length || 0) }}/{{ tCapacity(table) ?? '—' }}
            </q-badge>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div :class="['table-shape', tShape(table) === 'rect' ? 'table-rect' : 'table-circle']">
              <div class="table-core" :class="{ 'rect-core': tShape(table) === 'rect' }">
                <q-icon name="event_seat" size="20px" class="q-mb-xs table-core-icon" />
                <div class="text-subtitle2 table-core-title">{{ tName(table) }}</div>
              </div>

              <div
                v-for="(g, i) in tGuests(table)"
                :key="g.id || i"
                class="seat-chip"
                :class="{ 'is-current': currentGuestIds.has(normalizeGuestId(g)) }"
                :style="seatStyle(i, (tGuests(table) || []).length, tShape(table))"
                :title="g.attributes?.name || g.attributes?.invitationname || ('Gast ' + (g.id ?? i+1))"
              >
                <q-chip
                  dense
                  :outline="!currentGuestIds.has(normalizeGuestId(g))"
                  :ripple="false"
                >
                  {{ g.attributes?.name || g.attributes?.invitationname || ('Gast ' + (g.id ?? i+1)) }}
                </q-chip>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </div>
</template>

<script>
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import sal from "sal.js";

export default defineComponent({
  name: "seatplan",
  data() {
    return {
      calloutActive: false,
      salInHandler: null,
      calloutTimer: null,
    };
  },
  computed: {
    ...mapGetters({
      invitationGuests: "guest/guests",
      tables: "tables/tables"
    }),
    currentGuestIds() {
      return new Set(
        (this.invitationGuests || []).map((g) => g.id ?? g.externalId)
      );
    }
  },
  mounted() {
    sal();
    // Expectation: tables are preloaded at page/parent level (same pattern as confirm.vue)
    this.salInHandler = (e) => {
      const el = e && e.detail && e.detail.target;
      if (!el || !this.$refs.root) return;
      const isOurCard = el.classList && el.classList.contains('seat-card') && this.$refs.root.contains(el);
      if (!isOurCard) return;
      // Only trigger when this card includes current/own guests
      if (!el.classList.contains('has-current')) return;
      const dur = parseInt(el.getAttribute('data-sal-duration') || '400', 10);
      clearTimeout(this.calloutTimer);
      this.calloutTimer = setTimeout(() => {
        if (!this.calloutActive) this.calloutActive = true;
      }, Math.min(Math.max(dur, 200), 2000));
    };
    document.addEventListener('sal:in', this.salInHandler);
  },
  beforeUnmount() {
    if (this.salInHandler) document.removeEventListener('sal:in', this.salInHandler);
    if (this.calloutTimer) clearTimeout(this.calloutTimer);
  },
  methods: {
    tName(t) {
      return t?.name ?? t?.attributes?.name ?? "Tisch";
    },
    tCapacity(t) {
      return t?.capacity ?? t?.attributes?.capacity ?? null;
    },
    tGuests(t) {
      return t?.guests?.data ?? t?.attributes?.guests?.data ?? [];
    },
    tShape(t) {
      return t?.shape ?? t?.attributes?.shape ?? "round";
    },
    hasCurrent(table) {
      const list = this.tGuests(table);
      if (!list || !list.length) return false;
      const set = this.currentGuestIds;
      for (const g of list) {
        if (set.has(this.normalizeGuestId(g))) return true;
      }
      return false;
    },
    normalizeGuestId(g) {
      return g?.id ?? g?.attributes?.externalId ?? null;
    },
    seatStyle(i, total, shape) {
      if (!total) return {};
      return shape === "rect" ? this._seatStyleRect(i, total) : this._seatStyleRound(i, total);
    },
    _seatStyleRound(i, total) {
      const angle = (i / total) * 360;
      const radius = 115; // px
      return {
        transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg) translate(-50%, -50%)`
      };
    },
    _seatStyleRect(i, total) {
      // Place seats only on the two long sides, seems way better on rect tables :D
      const halfW = 140; // px (must mirror CSS .table-rect width/2)
      const halfH = 100; // px (must mirror CSS .table-rect height/2)

      if (total <= 0) return {};

      const horizontalLong = halfW >= halfH;

      if (horizontalLong) {
        const topCount = Math.ceil(total / 2);
        const bottomCount = total - topCount;

        if (i < topCount) {
          const pos = i + 1;
          const stepX = (2 * halfW) / (topCount + 1);
          const x = -halfW + stepX * pos;
          const y = -halfH; // top edge
          return { transform: `translate(${x}px, ${y}px)` };
        } else {
          const j = i - topCount + 1;
          const stepX = (2 * halfW) / (bottomCount + 1 || 1);
          const x = -halfW + stepX * j;
          const y = halfH; // bottom edge
          return { transform: `translate(${x}px, ${y}px)` };
        }
      } else {
        const leftCount = Math.ceil(total / 2);
        const rightCount = total - leftCount;

        if (i < leftCount) {
          const pos = i + 1;
          const stepY = (2 * halfH) / (leftCount + 1);
          const y = -halfH + stepY * pos;
          const x = -halfW; // left edge
          return { transform: `translate(${x}px, ${y}px)` };
        } else {
          const j = i - leftCount + 1;
          const stepY = (2 * halfH) / (rightCount + 1 || 1);
          const y = -halfH + stepY * j;
          const x = halfW; 
          return { transform: `translate(${x}px, ${y}px)` };
        }
      }
    },
  }
});
</script>
<style lang="scss">
$shadow-ui: 0 10px 24px rgba(0, 0, 0, 0.08);
$shadow-chip: 0 2px 6px rgba(0, 0, 0, 0.06);

.seat-card {
  backdrop-filter: blur(6px);
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: $shadow-ui;
}

.table-shape {
  position: relative;
  margin: 0 auto;
}
.table-circle {
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(closest-side, #f7f7f9, #ececf1);
  border: 2px dashed rgba(0, 0, 0, 0.08);
}
.table-rect {
  width: 320px;
  height: 220px;
  border-radius: 12px;
  background: linear-gradient(180deg, #f7f7f9, #ececf1);
  border: 2px dashed rgba(0, 0, 0, 0.08);
}

.table-core {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: $shadow-ui, inset 0 0 0 6px #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 8px;
  color: inherit;
}
.table-core.rect-core {
  width: 160px;
  height: 100px;
  border-radius: 12px;
}

.table-core-icon { color: $grey-7; margin-bottom: 6px; }
.table-core-title { font-weight: 400; }

.seat-chip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
}

.seat-chip .q-chip {
  font-weight: 600;
  background: var(--q-surface, #ffffff);
  color: var(--q-dark);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: $shadow-chip;
  border-radius: 9999px;
}

.seat-chip.is-current .q-chip {
  background: var(--q-primary);
  color: #fff;
  border-color: transparent;
  position: relative;
}
// Animation is only enabled when .callout-active is present on root
.seat-chip.is-current .q-chip::after {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 9999px;
  border: 2px solid var(--q-primary);
  opacity: 0;
  animation: none;
  pointer-events: none;
}
.callout-active .seat-chip.is-current .q-chip::after {
  animation: seatpulse 1.2s ease-out 0s 3;
}
@keyframes seatpulse {
  0% { opacity: 0.6; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.2); }
}
@media (prefers-reduced-motion: reduce) {
  .seat-chip.is-current .q-chip::after { animation: none; }
}

.seat-card {
  color: var(--q-dark);
}
.seat-card .text-h6,
.seat-card .text-subtitle2 {
  color: var(--q-dark);
}
</style>