document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const compressionControls = document.getElementById('compressionControls');
    const previewArea = document.getElementById('previewArea');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;

    // 上传处理
    function handleUpload(file) {
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImage = new Image();
                originalImage.src = e.target.result;
                originalImage.onload = () => {
                    originalPreview.src = originalImage.src;
                    originalSize.textContent = `原始大小：${formatFileSize(file.size)}`;
                    
                    compressionControls.style.display = 'block';
                    previewArea.style.display = 'block';
                    
                    compressImage();
                };
            };
            reader.readAsDataURL(file);
        }
    }

    // 拖放处理
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleUpload(e.dataTransfer.files[0]);
    });

    // 点击上传
    uploadArea.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', (e) => handleUpload(e.target.files[0]));

    // 压缩质量控制
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        compressImage();
    });

    // 图片压缩
    function compressImage() {
        if (!originalImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        ctx.drawImage(originalImage, 0, 0);

        const quality = qualitySlider.value / 100;
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

        compressedPreview.src = compressedDataUrl;

        // 计算压缩后大小
        const compressedBytes = Math.round((compressedDataUrl.length * 3) / 4);
        compressedSize.textContent = `压缩后：${formatFileSize(compressedBytes)}`;

        // 设置下载
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = `compressed-${Date.now()}.jpg`;
            link.href = compressedDataUrl;
            link.click();
        };
    }

    // 文件大小格式化
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 