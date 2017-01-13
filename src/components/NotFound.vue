<template>
  <div class="notfound">
    <div class="nf">
      <h1 class="nf-title">404</h1>
      <div class="nf-detail">
        <p>No worries! It's just a 404 page.</p>
        <p>Just navigate to any exiting page.</p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .notfound {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Tahoma;

    .nf {
      width: 100%;
      position: relative;
      text-align: center;
      color: #20a0ff;

      .nf-title {
        margin: 0;
        font-size: 18rem;
        font-weight: bold;
      }

      .nf-detail {
        font-size: 1.3rem;
        position: absolute;
        top: 45%;
        left: 0;
        margin-top: -52px;
        background-color: #fff;
        box-shadow: 0 0 6px #fff;
        width: 100%;

        p {
          margin: 8px;
        }
      }
    }
  }
</style>
