<template>
  <div class="handle-outside"
       v-cloak>
    <vm-handle-risks :threats="threats">
      <slot slot="name">
        <span>Top5 External Threat Assets</span>
      </slot>
      <slot slot="types">
        <span>Top 5 External Threat Categories</span>
      </slot>
      <slot>
        <div class="outside-middle">
          <div class="osm-top">
            <img class="osm-img"
                 src="../../../../assets/images/handle/risks/edit.png">
            <span class="osm-title">Threat and Security Recommendations</span>
          </div>
          <div class="osm-middle">
            <dl>
              <dt class="osm-dt">Threat Description</dt>
              <dd class="osm-dd">An external threat is an attack on an asset that is exposed on the Internet or that has access to the Internet to scan and obtain initial access. Attacks include scanning, exploiting vulnerabilities, phishing e-mails, supply chain attacks, and leaked legitimate account logins.</dd>
            </dl>
            <dl>
              <dt class="osm-dt">Security Recommendations</dt>
              <dd class="osm-dd">
                <ul>
                  <li>1. Update patches in time, especially the first few days of critical vulnerability released is a high incidence period of advanced attacks;</li>
                  <li>2. Use security gateway and endpoint security for defense-in-depth;</li>
                  <li>3. Use threat intelligence to identify phishing addresses, malicious certificates with timely blocking;</li>
                  <li>4. Enhance threat detection and response capabilities on top of solid security defenses.</li>
                </ul>
              </dd>
            </dl>
          </div>
        </div>
      </slot>
    </vm-handle-risks>
  </div>
</template>

<script type="text/ecmascript-6">
import VmHandleRisks from '../vm-handle/vm-handle-risks'
import { eventBus } from '@/components/common/eventBus.js';
export default {
  name: 'handle-outside',
  data () {
    return {
      threats: 'externalthreat'
    };
  },
  components: { VmHandleRisks },
  created () {
    this.check_passwd();
  },
  methods: {
    // 测试密码过期
    check_passwd () {
      this.$axios.get('/yiiapi/site/check-passwd-reset')
        .then((resp) => {
          let {
            status,
            msg,
            data
          } = resp.data;
          if (status == '602') {
            this.$message(
              {
                message: msg,
                type: 'warning',
              }
            );
            eventBus.$emit('reset')
          }
        })
    }
  }
};
</script>

<style scoped lang="less">
</style>

