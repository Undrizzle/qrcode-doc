<template>
  <div class="app-container documentation-container">
    <el-row>
      <el-upload
        ref="fileUpload"
        class="document-upload"
        action="http://127.0.0.1:3000/documents/post"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-progress="handleProgress"
        :before-upload="handleUpload"
        :limit="1"
        :file-list="fileList"
        :disabled="fileControl"
      >
        <el-tooltip effect="dark" content="只能上传docx文件" placement="top">
          <el-button type="success" class="document-add-btn">上传
            <i class="el-icon-upload el-icon-right" />
          </el-button>
        </el-tooltip>
      </el-upload>
    </el-row>
    <el-row class="document-lists">
      <el-col v-for="doc in docs" :key="doc.name" :span="6" class="document-col">
        <el-popover
          placement="bottom"
          width="200"
          trigger="click"
        >
          <div class="qrcode-container">
            <qrcode :id="doc.name" :value="doc.url" :options="{ width: 160 }" />
            <el-row>
              <el-button type="success" icon="el-icon-download" circle @click="downloadQrcode(doc.name)" />
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteDoc(doc.name)" />
              <el-button type="primary" icon="el-icon-view" circle @click="openDoc(doc.url)" />
            </el-row>
          </div>
          <el-button slot="reference" class="document-btn">{{ doc.name }}</el-button>
        </el-popover>
      </el-col>

    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { saveAs } from 'file-saver'

export default {
  name: 'Documentation',
  data() {
    return {
      fileList: [],
      fileControl: false
    }
  },
  computed: {
    ...mapGetters([
      'docs'
    ])
  },
  mounted() {
    this.$store.dispatch('document/achieve')
  },
  methods: {
    handleSuccess(response, file, fileList) {
      this.$message.success('上传文件成功')
      this.$refs.fileUpload.clearFiles()
      this.fileControl = false
      this.$store.dispatch('document/add', response.data)
    },
    handleError(err, file, fileList) {
      if (err) {
        this.$message.error('上传文件失败')
      }
      this.fileControl = false
    },
    handleProgress(event, file, fileList) {
      this.fileControl = true
    },
    handleUpload(file) {
      if (!/\.(docx)$/.test(file.name)) {
        this.$message.error('上传文件格式不对')
        return false
      }
      const name = file.name.replace('.docx', '')
      if (!/^[0-9a-zA-Z]+$/.test(name)) {
        this.$message.error('上传文件不能包含汉字和特殊字符')
        return false
      }
    },
    openDoc(url) {
      window.open(url, '_blank')
    },
    deleteDoc(name) {
      this.$store.dispatch('document/delete', name)
    },
    downloadQrcode(name) {
      const canvas = document.getElementById(name)
      const downName = name + '.png'
      canvas.toBlob((blob) => {
        saveAs(blob, downName)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.documentation-container {

  .document-upload {
    width: 100%;
    text-align: right;
    height: 80px;
  }

  .document-lists {
    margin-top: 20px;
  }

  .document-col {
    margin-bottom: 50px;
  }

  .document-btn {
    float: left;
    margin-left: 50px;
    display: block;
    cursor: pointer;
    background: black;
    color: white;
    height: 60px;
    width: 200px;
    font-size: 20px;
    text-align: center;
  }
}

.qrcode-container {
  text-align: center;
}
</style>
