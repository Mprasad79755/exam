import React from 'react';

class FullscreenHelper {
  static async requestFullscreen() {
    try {
      const element = document.documentElement;
      
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.mozRequestFullScreen) { // Firefox
        await element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) { // Chrome, Safari, Opera
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) { // IE/Edge
        await element.msRequestFullscreen();
      } else {
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      return false;
    }
  }

  static exitFullscreen() {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }

  static isFullscreen() {
    return !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  }
}

export default FullscreenHelper;