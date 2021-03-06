package com.vaenow.appupdate.android;

import android.app.Dialog;
import android.content.Context;
import android.os.Environment;
import android.widget.ProgressBar;
import org.apache.cordova.LOG;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;

/**
 * 下载文件线程
 */
public class DownloadApkThread implements Runnable {
    private String TAG = "DownloadApkThread";

    /* 保存解析的XML信息 */
    HashMap<String, String> mHashMap;
    /* 下载保存路径 */
    private String mSavePath;
    /* 记录进度条数量 */
    private int progress;
    /* 更新进度条 */
    private ProgressBar mProgress;
    /* 是否取消更新 */
    private boolean cancelUpdate = false;
    private Dialog mDownloadDialog;
    private Context mContext;
    private DownloadHandler mHandler;

    public DownloadApkThread(Context mContext, ProgressBar mProgress, Dialog mDownloadDialog, HashMap<String, String> mHashMap) {
        this.mContext = mContext;
        this.mProgress = mProgress;
        this.mDownloadDialog = mDownloadDialog;
        this.mHashMap = mHashMap;

        this.mSavePath = mContext.getExternalCacheDir().getPath();
        this.mHandler = new DownloadHandler(mContext, mProgress, mSavePath, mHashMap);
    }


    @Override
    public void run() {
        InputStream is = null;
        FileOutputStream fos = null;
        try {
            // 获得存储卡的路径
            URL url = new URL(mHashMap.get("url"));
            // 创建连接
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.connect();
            // 获取文件大小
            int length = conn.getContentLength();
            // 创建输入流
            is = conn.getInputStream();

            File file = new File(mSavePath);
            // 判断文件目录是否存在
            if (!file.exists()) {
                file.mkdir();
            }
            File apkFile = new File(mSavePath, mHashMap.get("name"));
            fos = new FileOutputStream(apkFile);
            int count = 0;
            // 缓存
            byte buf[] = new byte[1024];

            // 写入到文件中
            do {
                int numread = is.read(buf);
                count += numread;
                // 计算进度条位置
                progress = (int) (((float) count / length) * 100);
                mHandler.updateProgress(progress);
                // 更新进度
                mHandler.sendEmptyMessage(Constants.DOWNLOAD);
                if (numread <= 0) {
                    // 下载完成
                    mHandler.sendEmptyMessage(Constants.DOWNLOAD_FINISH);
                    break;
                }
                // 写入文件
                fos.write(buf, 0, numread);
            } while (!cancelUpdate);// 点击取消就停止下载.
        } catch (Exception ex) {
            LOG.e(TAG, "error", ex);
        } finally {
            try {
                if(fos != null) {
                    fos.close();
                }
                if(is != null) {
                    is.close();
                }
            } catch ( IOException ex) {
            }
        }
        // 取消下载对话框显示
        mDownloadDialog.dismiss();
    }

    public void cancelBuildUpdate() {
        this.cancelUpdate = true;
    }
}
