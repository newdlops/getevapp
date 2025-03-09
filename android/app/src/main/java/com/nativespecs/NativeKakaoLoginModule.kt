package com.nativespecs

import android.content.Context
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.kakao.sdk.common.util.Utility
import com.kakao.sdk.user.UserApiClient


class NativeKakaoLoginModule(reactApplicationContext: ReactApplicationContext) : NativeKakaoLoginSpec(reactApplicationContext) {
  var TAG = "내정보"
  override fun getName() = NAME

  override fun isKakaoTalkLoginAvailable(): Boolean {
    return UserApiClient.instance.isKakaoTalkLoginAvailable(reactApplicationContext)
  }

  override fun loginWithKakaoTalk(): Boolean {
    val currentActivity = currentActivity

    // 현재 액티비티가 있다면 해당 컨텍스트 사용, 없으면 기본 컨텍스트에 FLAG 추가
    val context: Context = if ((currentActivity != null)) currentActivity else reactApplicationContext

    var isLogged = UserApiClient.instance.loginWithKakaoTalk(context) { token, error ->

      if (error != null) {
        Log.i("태그다","로그인실패" + error)
      }
      else if (token != null) {
        Log.i("태그다","로그인성공" + token)
      }
    }
    Log.i("태그다","로그인동작" + isLogged)
    return true
  }

  override fun loginWithNewScope(): Boolean {
    val currentActivity = currentActivity

    // 현재 액티비티가 있다면 해당 컨텍스트 사용, 없으면 기본 컨텍스트에 FLAG 추가
    val context: Context = if ((currentActivity != null)) currentActivity else reactApplicationContext

    UserApiClient.instance.me { user, error ->
      if (error != null) {
        Log.e(TAG, "사용자 정보 요청 실패", error)
      }
      else if (user != null) {
        Log.e(TAG, "사용자 정보 요청 성공 ${user}")
        var scopes = mutableListOf<String>()

        if (user.kakaoAccount?.emailNeedsAgreement == true) { scopes.add("account_email") }
//        if (user.kakaoAccount?.birthdayNeedsAgreement == true) { scopes.add("birthday") }
//        if (user.kakaoAccount?.birthyearNeedsAgreement == true) { scopes.add("birthyear") }
//        if (user.kakaoAccount?.genderNeedsAgreement == true) { scopes.add("gender") }
//        if (user.kakaoAccount?.phoneNumberNeedsAgreement == true) { scopes.add("phone_number") }
//        if (user.kakaoAccount?.profileNeedsAgreement == true) { scopes.add("profile") }
//        if (user.kakaoAccount?.ageRangeNeedsAgreement == true) { scopes.add("age_range") }

        if (scopes.count() > 0) {
          Log.d(TAG, "사용자에게 추가 동의를 받아야 합니다.")

          // OpenID Connect 사용 시
          // scope 목록에 "openid" 문자열을 추가하고 요청해야 함
          // 해당 문자열을 포함하지 않은 경우, ID 토큰이 재발급되지 않음
          // scopes.add("openid")

          //scope 목록을 전달하여 카카오 로그인 요청
          UserApiClient.instance.loginWithNewScopes(context, scopes) { token, error ->
            if (error != null) {
              Log.e(TAG, "사용자 추가 동의 실패", error)
            } else {
              Log.d(TAG, "사용자 추가 동의 성공: ${token!!.scopes}")

              // 사용자 정보 재요청
              UserApiClient.instance.me { user, error ->
                if (error != null) {
                  Log.e(TAG, "사용자 정보 요청 실패", error)
                }
                else if (user != null) {
                  Log.i(TAG, "사용자 정보 요청 성공: ${user}")
                }
              }
            }
          }
        }
      }
    }
    return true
  }

  override fun getHash(): String {
    return Utility.getKeyHash(reactApplicationContext)
  }

  companion object {
    const val NAME = "NativeKakaoLogin"
  }
}