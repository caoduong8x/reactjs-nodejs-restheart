module.exports = Object.freeze({

  RESPONSE_ERR_BADREQUEST: {
    status: 400,
    body: {
      message: 'Yêu cầu không hợp lệ'
    }
  },
  RESPONSE_ERR_NOTFOUND: {
    status: 404,
    body: {
      message: 'Không tìm thấy tài nguyên'
    }
  },
  RESPONSE_ERR_TOO_MANY_REQUEST: {
    status: 429,
    body: {
      message: 'Số lượng yêu cầu vượt quá giới hạn'
    }
  },
  RESPONSE_ERR_DATABASE: {
    status: 500,
    body: {
      message: 'Lỗi kết nối CSDL'
    }
  },
  RESPONSE_ERR_SIGNIN: {
    status: 400,
    body: {
      message: 'Tài khoản hoặc mật khẩu không chính xác'
    }
  },
  RESPONSE_ERR_SIGNIN_ACTIVE: {
    status: 400,
    body: {
      message: 'Tài khoản chưa được kích hoạt hoặc đã bị xóa'
    }
  },
  RESPONSE_ERR_NOTAUTHORIZED: {
    status: 401,
    body: {
      message: 'Lỗi xác thực tài khoản'
    }
  },
  RESPONSE_ERR_SERVICE: {
    status: 500,
    body: {
      message: 'Lỗi kết nối dịch vụ'
    }
  },
  RESPONSE_ERR_FORMAT_JSON: {
    status: 415,
    body: {
      message: "Dữ liệu không phù hợp (Unsupported media type if request doesn't have JSON body)"
    }
  },
  RESPONSE_ERR_PERMISTION: {
    status: 405,
    body: {
      message: "Tài khoản không có quyền thực hiện thao tác này"
    }
  },
  RESPONSE_ERR_CODE_EXITSTED: {
    status: 400,
    body: {
      message: "Dữ liệu có Mã tương ứng đã tồn tại"
    }
  },
  RESPONSE_ERR_NO_PERMISSION_SIGNIN: {
    status: 400,
    body: {
      message: 'Tài khoản chưa được cấp quyền thao tác hệ thống'
    }
  },
  RESPONSE_ERR_DELETE_EXITSTED: {
    status: 403,
    body: {
      message: "Xoá các Nhóm Danh mục hoặc Danh mục phụ thuộc trước"
    }
  },
});